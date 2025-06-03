// // Created by Kateřina Plívová on 28.05.2025.

using backend.Domain;

public class Contract
{
    public int Id { get; set; }
    public string ReferenceNumber { get; set; }
    public string Institution { get; set; }
    public DateTime SignedDate { get; set; }
    public DateTime MaturityDate { get; set; }
    public DateTime ValidUntilDate { get; set; }

    public int ClientId { get; set; }
    public Client Client { get; }
    
    public int? ManagerId { get; set; }
    public Advisor Manager { get; set; }
    
    public List<Advisor> Advisors { get; set; }
}