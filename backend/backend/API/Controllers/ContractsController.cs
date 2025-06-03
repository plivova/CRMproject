// // Created by Kateřina Plívová on 28.05.2025.

using backend.Application.Common;
using backend.Application.Contracts.Commands;
using backend.Application.Contracts.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<List<ContractDto>> GetContracts([FromQuery] GetContractsQuery query)
    {
        return await mediator.Send(query);
    }

    [HttpGet("{contractId}")]
    public async Task<ContractDto> GetContract(int contractId)
    {
        return await mediator.Send(new GetContractQuery { ContractId = contractId }); 
    }

    [HttpPost]
    public async Task<StatusDto> AddContract(AddContractCommand command)
    {
        return await mediator.Send(command);
    }

    [HttpDelete("{contractId}")]
    public async Task<StatusDto> DeleteContract(int contractId)
    {
        return await mediator.Send(new DeleteContractCommand { ContractId = contractId });
    }

    [HttpPut("{contractId}")]
    public async Task<StatusDto> UpdateContract([FromRoute] int contractId, [FromBody] UpdateContractCommand command)
    {
        command.Id = contractId;
        return await mediator.Send(command);
    }
}