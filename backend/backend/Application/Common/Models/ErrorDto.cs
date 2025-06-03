// // Created by Kateřina Plívová on 28.05.2025.

using System.Net;

namespace backend.Application.Common;

public class ErrorDto
{
    public string Message { get; set; }
    public HttpStatusCode HttpStatusCode { get; set; }
}