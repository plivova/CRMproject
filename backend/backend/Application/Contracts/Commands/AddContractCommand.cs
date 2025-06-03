// // Created by Kateřina Plívová on 28.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Contracts.Commands;

public class AddContractCommand: IRequest<StatusDto>
{
    
    public string ReferenceNumber { get; set; }
    public string Institution { get; set; }
    public DateTime SignedDate { get; set; }
    public DateTime MaturityDate { get; set; }
    public DateTime ValidUntilDate { get; set; }
    public int ClientId { get; set; }
    public int ManagerId { get; set; }
    public List<int> AdvisorsIds { get; set; }
}

public class AddContractCommandHandler(AppDbContext context) : IRequestHandler<AddContractCommand, StatusDto>
{
    public async Task<StatusDto> Handle(AddContractCommand request, CancellationToken cancellationToken)
    {
        var contractExists = await context.Contracts
            .AnyAsync(p => p.ReferenceNumber == request.ReferenceNumber, cancellationToken);

        if (contractExists)
        {
            throw new EntityConflictException();
        }
        
        // Validate: manager must be in advisor list
        if (!request.AdvisorsIds.Contains(request.ManagerId))
        {
            throw new EntityConflictException("The manager must also be in the list of advisors.");
        }

        var advisors = await context.Advisors
            .Where(a => request.AdvisorsIds.Contains(a.Id))
            .ToListAsync(cancellationToken);
        
        var contract = new Contract
        {
            ReferenceNumber = request.ReferenceNumber,
            MaturityDate = request.MaturityDate,
            SignedDate = request.SignedDate,
            Institution = request.Institution,
            ValidUntilDate = request.ValidUntilDate,
            ClientId = request.ClientId,
            ManagerId = request.ManagerId,
            Advisors = advisors
        };

        try
        {
            await context.Contracts.AddAsync(contract, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when adding new contract.");
        }

        return new StatusDto
        {
            Message = "Contract was created."
        };
    }
}