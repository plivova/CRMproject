// // Created by Kateřina Plívová on 29.05.2025.

using AutoMapper;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Advisors.Queries;

public class GetAdvisorsQuery: IRequest<List<AdvisorDto>>;

public class GetAdvisorsQueryHandler(AppDbContext context, IMapper mapper) : IRequestHandler<GetAdvisorsQuery, List<AdvisorDto>>
{
    public async Task<List<AdvisorDto>> Handle(GetAdvisorsQuery request, CancellationToken cancellationToken)
    {
        var advisors = await context.Advisors
            .Include(p => p.Contracts)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return mapper.Map<List<AdvisorDto>>(advisors);
    }
}