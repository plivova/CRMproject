// // Created by Kateřina Plívová on 01.06.2025.
namespace backend.Application.Contracts.Queries;

public class ContractDto
{
    public int Id { get; set; }
    public string ReferenceNumber { get; set; }
    public string Institution { get; set; }
    public DateTime SignedDate { get; set; }
    public DateTime MaturityDate { get; set; }
    public DateTime ValidUntilDate { get; set; }
    public ContractClientDto Client { get; set; }
    public ContractAdvisorDto Manager { get; set; }
    public List<ContractAdvisorDto> Advisors { get; set; }
}

public class ContractClientDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string BirthNumber { get; set; }
    public int Age { get; set; }
}

public class ContractAdvisorDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string BirthNumber { get; set; }
    public int Age { get; set; }
}