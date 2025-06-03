// // Created by Kateřina Plívová on 28.05.2025.

using AutoMapper;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Contracts.Queries;

public class GetContractsQuery: IRequest<List<ContractDto>>;

public class GetContractsQueryHandler(AppDbContext context, IMapper mapper) : IRequestHandler<GetContractsQuery, List<ContractDto>>
{
    public async Task<List<ContractDto>> Handle(GetContractsQuery request, CancellationToken cancellationToken)
    {
        var contracts = await context.Contracts
            .Include(p => p.Client)
            .Include(p => p.Advisors)
            .Include(p => p.Manager)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
        
        return mapper.Map<List<ContractDto>>(contracts);
    }
}