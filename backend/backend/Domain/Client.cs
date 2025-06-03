// // Created by Kateřina Plívová on 28.05.2025.

namespace backend.Domain;

public class Client
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string BirthNumber { get; set; }
    public int Age { get; set; }
    public virtual List<Contract> Contracts { get; }
}