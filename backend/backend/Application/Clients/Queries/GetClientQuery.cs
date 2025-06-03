// // Created by Kateřina Plívová on 29.05.2025.

using AutoMapper;
using backend.Domain;

namespace backend.Application.Clients.Queries;

using backend.API.Middleware;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetClientQuery : IRequest<ClientDto>
{
    public int ClientId { get; set; }
}

public class GetClientQueryHandler(AppDbContext context, IMapper mapper) : IRequestHandler<GetClientQuery, ClientDto>
{
    public async Task<ClientDto> Handle(GetClientQuery request, CancellationToken cancellationToken)
    {
        var client = await context.Clients
            .Include(p => p.Contracts)
            .AsNoTracking()
            .Where(p => p.Id == request.ClientId)
            .FirstOrDefaultAsync(cancellationToken);

        if (client == null)
        {
            throw new NotFoundException();
        }

        return mapper.Map<ClientDto>(client);
    }
}