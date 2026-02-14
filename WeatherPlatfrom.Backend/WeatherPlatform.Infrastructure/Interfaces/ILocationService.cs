using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WeatherPlatform.Domain.Dtos;
using WeatherPlatform.Domain.Entities;

namespace WeatherPlatform.Infrastructure.Interfaces
{
    public interface ILocationService
    {
        Task<WeatherResponseDto> CreateLocation(CreateLocationDto city);
        Task<Location> UpdateLocation(UpdateLocationDto updatedLocation);
        Task<List<WeatherSnapshotResponseDto>> GetAll();
        Task<string> DeleteLocation(int id);
    }
}
