// // Created by Kateřina Plívová on 28.05.2025.

using AutoMapper;
using backend.API.Middleware;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Contracts.Queries;

public class GetContractQuery : IRequest<ContractDto>
{
    public int ContractId { get; set; }
}

public class GetContractQueryHandler(AppDbContext context, IMapper mapper) : IRequestHandler<GetContractQuery, ContractDto>
{
    public async Task<ContractDto> Handle(GetContractQuery request, CancellationToken cancellationToken)
    {
        var contract = await context.Contracts
            .Include(p => p.Client)
            .Include(p => p.Advisors)
            .Include(p => p.Manager)
            .AsNoTracking()
            .Where(p => p.Id == request.ContractId)
            .FirstOrDefaultAsync(cancellationToken);

        if (contract == null)
        {
            throw new NotFoundException();
        }

        return mapper.Map<ContractDto>(contract);
    }
}