// // Created by Kateřina Plívová on 29.05.2025.

using AutoMapper;
using backend.API.Middleware;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Advisors.Queries;

public class GetAdvisorQuery : IRequest<AdvisorDto>
{
    public int AdvisorId { get; set; }
}

public class GetAdvisorQueryHandler(AppDbContext context, IMapper mapper) : IRequestHandler<GetAdvisorQuery, AdvisorDto>
{
    public async Task<AdvisorDto> Handle(GetAdvisorQuery request, CancellationToken cancellationToken)
    {
        var advisor = await context.Advisors
            .Include(p => p.Contracts)
            .AsNoTracking()
            .Where(p => p.Id == request.AdvisorId)
            .FirstOrDefaultAsync(cancellationToken);

        if (advisor == null)
        {
            throw new NotFoundException();
        }

        return mapper.Map<AdvisorDto>(advisor);
    }
}