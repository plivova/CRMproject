// // Created by Kateřina Plívová on 28.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Domain;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Contracts.Commands;

public class UpdateContractCommand: IRequest<StatusDto>
{
    public int Id { get; set; }
    public string ReferenceNumber { get; set; }
    public string Institution { get; set; }
    public DateTime SignedDate { get; set; }
    public DateTime MaturityDate { get; set; }
    public DateTime ValidUntilDate { get; set; }
    public int ClientId { get; set; }
    public int ManagerId { get; set; }
    public List<int> AdvisorsIds { get; set; }
}

public class UpdateContractCommandHandler(AppDbContext context) : IRequestHandler<UpdateContractCommand, StatusDto>
{
    public async Task<StatusDto> Handle(UpdateContractCommand request, CancellationToken cancellationToken)
    {
        var contract = await context.Contracts
            .Include(p => p.Advisors)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (contract == null)
        {
            throw new NotFoundException();
        }

        var advisors = await context.Advisors
            .Where(p => request.AdvisorsIds.Contains(p.Id))
            .ToListAsync(cancellationToken);
        
        contract.MaturityDate = request.MaturityDate;
        contract.Institution = request.Institution;
        contract.SignedDate = request.SignedDate;
        contract.ValidUntilDate = request.ValidUntilDate;
        contract.ClientId = request.ClientId;
        contract.ManagerId = request.ManagerId;
        contract.Advisors = advisors;
        
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when updating contract.");
        }

        return new StatusDto
        {
            Message = "Contract was updated."
        };
    }
}