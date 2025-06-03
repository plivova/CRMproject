// // Created by Kateřina Plívová on 28.05.2025.

using backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Client> Clients { get; set; }
    public DbSet<Advisor> Advisors { get; set; }
    public DbSet<Contract> Contracts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(string) && property.GetMaxLength() == null)
                {
                    property.SetMaxLength(255);
                }
            }
        }

        modelBuilder.Entity<Contract>()
            .HasOne(p => p.Manager)
            .WithMany(p => p.ManagedContracts)
            .HasForeignKey(p => p.ManagerId);
        
        modelBuilder.Entity<Contract>()
            .HasMany(p => p.Advisors)
            .WithMany(p => p.Contracts);
        
        modelBuilder.Entity<Client>()
            .HasMany(p => p.Contracts)
            .WithOne(p => p.Client)
            .OnDelete(DeleteBehavior.Cascade);
    }
}