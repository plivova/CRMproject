// // Created by Kateřina Plívová on 29.05.2025.

using backend.Application.Advisors.Commands;
using backend.Application.Advisors.Queries;
using backend.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdvisorsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<List<AdvisorDto>> GetAdvisors([FromQuery] GetAdvisorsQuery query)
    {
        return await mediator.Send(query);
    }

    [HttpGet("{advisorId}")]
    public async Task<AdvisorDto> GetAdvisor(int advisorId)
    {
        return await mediator.Send(new GetAdvisorQuery { AdvisorId = advisorId }); 
    }

    [HttpPost]
    public async Task<StatusDto> AddAdvisor(AddAdvisorCommand command)
    {
        return await mediator.Send(command);
    }

    [HttpDelete("{advisorId}")]
    public async Task<StatusDto> DeleteAdvisor(int advisorId)
    {
        return await mediator.Send(new DeleteAdvisorCommand { AdvisorId = advisorId });
    }

    [HttpPut("{advisorId}")]
    public async Task<StatusDto> UpdateClient([FromRoute] int advisorId, [FromBody] UpdateAdvisorCommand command)
    {
        command.Id = advisorId;
        return await mediator.Send(command);
    }
}