// // Created by Kateřina Plívová on 01.06.2025.

namespace backend.Application.Advisors.Queries;

public class AdvisorDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string BirthNumber { get; set; }
    public int Age { get; set; }

    public List<AdvisorContractDto> Contracts { get; set; }
}

public class AdvisorContractDto
{
    public int Id { get; set; }
    public string ReferenceNumber { get; set; }
    public string Institution { get; set; }
    public DateTime SignedDate { get; set; }
    public DateTime MaturityDate { get; set; }
    public DateTime ValidUntilDate { get; set; }
}