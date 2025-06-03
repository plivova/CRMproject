// // Created by Kateřina Plívová on 28.05.2025.

using backend.Domain;

public class Advisor
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string BirthNumber { get; set; }
    public int Age { get; set; }

    public List<Contract> Contracts { get; set; }
    public List<Contract> ManagedContracts { get; set; }
}