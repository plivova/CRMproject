// // Created by Kateřina Plívová on 28.05.2025.

using System.Net;
using System.Text.Json;
using backend.Application.Common;

namespace backend.API.Middleware;

public class NotFoundException: Exception;
public class BadRequestException: Exception;
public class EntityConflictException(string? Message = null) : Exception(Message);

public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next, IServiceProvider serviceProvider)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                var statusCode = exception switch
                {
                    NotFoundException _ => HttpStatusCode.NotFound,
                    BadRequestException _ => HttpStatusCode.BadRequest,
                    EntityConflictException _ => HttpStatusCode.Conflict,
                    _ => HttpStatusCode.InternalServerError // default 500
                };

                var error = new ErrorDto
                {
                    Message = exception.Message,
                    HttpStatusCode = statusCode,
                };

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                };

                var result = JsonSerializer.Serialize(error, options);

                var response = context.Response;
                response.ContentType = "application/json";
                response.StatusCode = (int)statusCode;

                await response.WriteAsync(result);
            }
        }
    }
