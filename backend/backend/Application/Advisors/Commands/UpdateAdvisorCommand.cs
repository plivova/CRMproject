// // Created by Kateřina Plívová on 29.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Advisors.Commands;

public class UpdateAdvisorCommand : IRequest<StatusDto>
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set;}
    public string BirthNumber { get; set; }
    public int Age { get; set; }
}

public class UpdateAdvisorCommandHandler(AppDbContext context) : IRequestHandler<UpdateAdvisorCommand, StatusDto>
{
    public async Task<StatusDto> Handle(UpdateAdvisorCommand request, CancellationToken cancellationToken)
    {
        var advisor = await context.Advisors
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (advisor == null)
        {
            throw new NotFoundException();
        }

        advisor.FirstName = request.FirstName;
        advisor.LastName = request.LastName;
        advisor.Email = request.Email;
        advisor.Phone = request.Phone;
        advisor.BirthNumber = request.BirthNumber;
        advisor.Age = request.Age;

        try
        {
            await context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when updating advisor.");
        }

        return new StatusDto
        {
            Message = "Advisor was updated."
        };
    }
}