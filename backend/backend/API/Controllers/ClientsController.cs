// // Created by Kateřina Plívová on 29.05.2025.

using backend.Application.Clients.Commands;
using backend.Application.Clients.Queries;
using backend.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<List<ClientDto>> GetClients([FromQuery] GetClientsQuery query)
    {
        return await mediator.Send(query);
    }

    [HttpGet("{clientId}")]
    public async Task<ClientDto> GetClient(int clientId)
    {
        return await mediator.Send(new GetClientQuery() { ClientId = clientId }); 
    }

    [HttpPost]
    public async Task<StatusDto> AddClient(AddClientCommand command)
    {
        return await mediator.Send(command);
    }

    [HttpDelete("{clientId}")]
    public async Task<StatusDto> DeleteClient(int clientId)
    {
        return await mediator.Send(new DeleteClientCommand { ClientId = clientId });
    }

    [HttpPut("{clientId}")]
    public async Task<StatusDto> UpdateClient([FromRoute] int clientId, [FromBody] UpdateClientCommand command)
    {
        command.Id = clientId;
        return await mediator.Send(command);
    }
}