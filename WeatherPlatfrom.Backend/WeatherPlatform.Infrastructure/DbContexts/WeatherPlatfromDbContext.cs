using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WeatherPlatform.Domain.Entities;

namespace WeatherPlatform.Infrastructure.DbContexts
{
    public class WeatherPlatfromDbContext : DbContext
    {
        public WeatherPlatfromDbContext(DbContextOptions<WeatherPlatfromDbContext> options) : base(options) { }

        public DbSet<Location> Locations { get; set; }
        public DbSet<WeatherSnapshot> WeatherSnapshots { get; set; }
        public DbSet<ForecastSnapshot> ForecastSnapshots { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Location>()
                .HasMany(l => l.WeatherSnapshots)
                .WithOne(ws => ws.Location)
                .HasForeignKey(ws => ws.LocationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Location>()
                .HasMany(l => l.ForecastSnapshots)
                .WithOne(ws => ws.Location)
                .HasForeignKey(ws => ws.LocationId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
