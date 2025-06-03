// // Created by Kateřina Plívová on 29.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Advisors.Commands;

public class AddAdvisorCommand: IRequest<StatusDto>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set;}
    public string BirthNumber { get; set; }
    public int Age { get; set; }
}

public class AddAdvisorCommandHandler(AppDbContext context) : IRequestHandler<AddAdvisorCommand, StatusDto>
{
    public async Task<StatusDto> Handle(AddAdvisorCommand request, CancellationToken cancellationToken)
    {
        var advisorExists = await context.Advisors
            .AnyAsync(p => p.BirthNumber == request.BirthNumber, cancellationToken);

        if (advisorExists)
        {
            throw new EntityConflictException();
        }

        var advisor = new Advisor
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
            await context.Advisors.AddAsync(advisor, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when adding new advisor.");
        }

        return new StatusDto
        {
            Message = "Advisor was created."
        };
    }
}