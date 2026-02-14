using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WeatherPlatform.Domain.Dtos;
using WeatherPlatform.Domain.Entities;
using WeatherPlatform.Infrastructure.DbContexts;
using WeatherPlatform.Infrastructure.Interfaces;

namespace WeatherPlatform.Infrastructure.Services
{
    public class LocationService(IWeatherService weatherService, WeatherPlatfromDbContext weatherPlatfromDbContext) : ILocationService
    {
        private readonly IWeatherService _weatherService = weatherService;
        private readonly WeatherPlatfromDbContext _weatherPlatfromDbContext = weatherPlatfromDbContext;
        public async Task<WeatherResponseDto> CreateLocation(CreateLocationDto city)
        {
            var exist = _weatherPlatfromDbContext.Locations.FirstOrDefault(x => x.City == city.Name);
            if (exist == null)
            {
                var weatherResponse = await _weatherService.GetCurrentWeather(city.Name);
                var location = new Domain.Entities.Location
                {
                    City = city.Name,
                    Country = weatherResponse.sys.country,
                    Latitude = weatherResponse.coord.lat,
                    Longitude = weatherResponse.coord.lon,
                    IsFavorite = false,
                    CreatedAt = DateTime.UtcNow
                };
                await _weatherPlatfromDbContext.Locations.AddAsync(location);
                await _weatherPlatfromDbContext.SaveChangesAsync();

                await _weatherService.RefreshWeather(location.Id);
                await _weatherService.RefreshForecast(location.Id);
                return weatherResponse;
            }
            else
            {
                throw new Exception("Location already exists.");
            }
        }

        public async Task<string> DeleteLocation(int id)
        {
            var location = await _weatherPlatfromDbContext.Locations.FindAsync(id);
            if(location == null)
                throw new Exception("Location not found.");

            location.IsDeleted = true;
            await _weatherPlatfromDbContext.SaveChangesAsync();
            return $"{location.City} deleted successfully";
        }

        public async Task<List<WeatherSnapshotResponseDto>> GetAll()
        {
            var locations = await _weatherPlatfromDbContext.Locations
                .Where(l => l.IsDeleted == false)
                .Include(l => l.WeatherSnapshots.OrderByDescending(ws => ws.CreatedAt).Take(1))
                .Include(l => l.ForecastSnapshots.OrderByDescending(fs => fs.CreatedAt).Take(40).Where(fs => fs.ForecastDate.Hour == 12))
                .ToListAsync();

            var snapshots = locations.Select(l => l.WeatherSnapshots.FirstOrDefault()).Where(ws => ws != null).Select(ws => new WeatherSnapshotResponseDto
            {
                Id = ws.LocationId,
                City = ws.Location.City,
                Country = ws.Location.Country,
                latitude = ws.Location.Latitude,
                longitude = ws.Location.Longitude,
                Temp = ws.Temperature,
                Humidity = ws.Humidity,
                Description = ws.Description,
                LastSyncedAt = ws.CreatedAt,
                IsFavorite = ws.Location.IsFavorite,
                forecastSnapshots = ws.Location.ForecastSnapshots
            }).ToList();

            return snapshots;
        }

        public async Task<Location> UpdateLocation(UpdateLocationDto updatedLocation)
        {
            var location = await _weatherPlatfromDbContext.Locations.FindAsync(updatedLocation.Id);
            if (location == null)
            {
                throw new Exception("Location not found.");
            }

            location.IsFavorite = updatedLocation.IsFavorite;

            await _weatherPlatfromDbContext.SaveChangesAsync();
            return location;
        }
    }
}
