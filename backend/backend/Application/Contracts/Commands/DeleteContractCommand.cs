// // Created by Kateřina Plívová on 28.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Contracts.Commands;

public class DeleteContractCommand: IRequest<StatusDto>
{
    public int ContractId { get; set; }
}

public class DeleteContractCommandHandler : IRequestHandler<DeleteContractCommand, StatusDto>
{
    private readonly AppDbContext _context;

    public DeleteContractCommandHandler(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<StatusDto> Handle(DeleteContractCommand request, CancellationToken cancellationToken)
    {
        var contract = await _context.Contracts
            .FirstOrDefaultAsync(p => p.Id == request.ContractId, cancellationToken);

        if (contract == null)
        {
            throw new NotFoundException();
        }
        
        try
        {
            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when deleting contract.");
        }

        return new StatusDto
        {
            Message = "Contract was deleted."
        };
    }
}