// // Created by Kateřina Plívová on 29.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Clients.Commands;

public class UpdateClientCommand : IRequest<StatusDto>
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set;}
    public string BirthNumber { get; set; }
    public int Age { get; set; }
}

public class UpdateClientCommandHandler(AppDbContext context) : IRequestHandler<UpdateClientCommand, StatusDto>
{
    public async Task<StatusDto> Handle(UpdateClientCommand request, CancellationToken cancellationToken)
    {
        var client = await context.Clients
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (client == null)
        {
            throw new NotFoundException();
        }
        
        client.FirstName = request.FirstName;
        client.LastName = request.LastName;
        client.Email = request.Email;
        client.Phone = request.Phone;
        client.BirthNumber = request.BirthNumber;
        client.Age = request.Age;

        try
        {
            await context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when updating client.");
        }

        return new StatusDto
        {
            Message = "Client was updated."
        };
    }
}