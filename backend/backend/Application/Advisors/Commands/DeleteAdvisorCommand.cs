// // Created by Kateřina Plívová on 29.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Advisors.Commands;

public class DeleteAdvisorCommand: IRequest<StatusDto>
{
    public int AdvisorId { get; set; }
}

public class DeleteAdvisorCommandHandler(AppDbContext context) : IRequestHandler<DeleteAdvisorCommand, StatusDto>
{
    public async Task<StatusDto> Handle(DeleteAdvisorCommand request, CancellationToken cancellationToken)
    {
        var advisor = await context.Advisors
            .FirstOrDefaultAsync(p => p.Id == request.AdvisorId, cancellationToken);

        if (advisor == null)
        {
            throw new NotFoundException();
        }
        
        try
        {
            context.Advisors.Remove(advisor);
            await context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when deleting advisor.");
        }

        return new StatusDto
        {
            Message = "Advisor was deleted."
        };
    }
}