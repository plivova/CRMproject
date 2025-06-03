// // Created by Kateřina Plívová on 29.05.2025.

using backend.API.Middleware;
using backend.Application.Common;
using backend.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Clients.Commands;

public class DeleteClientCommand: IRequest<StatusDto>
{
    public int ClientId { get; set; }
}

public class DeleteClientCommandHandler(AppDbContext context) : IRequestHandler<DeleteClientCommand, StatusDto>
{
    public async Task<StatusDto> Handle(DeleteClientCommand request, CancellationToken cancellationToken)
    {
        var client = await context.Clients
            .FirstOrDefaultAsync(p => p.Id == request.ClientId, cancellationToken);

        if (client == null)
        {
            throw new NotFoundException();
        }
        
        try
        {
            context.Clients.Remove(client);
            await context.SaveChangesAsync(cancellationToken);
        } catch (Exception e)
        {
            throw new Exception("Error when deleting client.");
        }

        return new StatusDto
        {
            Message = "Client was deleted."
        };
    }
}