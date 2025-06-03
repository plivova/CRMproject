// // Created by Kateřina Plívová on 29.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Domain;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Clients.Commands;

public class AddClientCommand: IRequest<StatusDto>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set;}
    public string BirthNumber { get; set; }
    public int Age { get; set; }
}

public class AddClientCommandHandler(AppDbContext context) : IRequestHandler<AddClientCommand, StatusDto>
{
    public async Task<StatusDto> Handle(AddClientCommand request, CancellationToken cancellationToken)
    {
        var clientExists = await context.Clients
            .AnyAsync(p => p.BirthNumber == request.BirthNumber, cancellationToken);

        if (clientExists)
        {
            throw new EntityConflictException();
        }

        var client = new Client
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            BirthNumber = request.BirthNumber,
            Age = request.Age
        };

        try
        {
            await context.Clients.AddAsync(client, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when adding new client.");
        }

        return new StatusDto
        {
            Message = "Client was created."
        };
    }
}