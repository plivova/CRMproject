// // Created by Kateřina Plívová on 29.05.2025.

using AutoMapper;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Clients.Queries;

public class GetClientsQuery: IRequest<List<ClientDto>>;

public class GetClientsQueryHandler(AppDbContext context, IMapper mapper) : IRequestHandler<GetClientsQuery, List<ClientDto>>
{
    public async Task<List<ClientDto>> Handle(GetClientsQuery request, CancellationToken cancellationToken)
    {
        var clients = await context.Clients
            .Include(p => p.Contracts)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
        
        return mapper.Map<List<ClientDto>>(clients);
    }
}