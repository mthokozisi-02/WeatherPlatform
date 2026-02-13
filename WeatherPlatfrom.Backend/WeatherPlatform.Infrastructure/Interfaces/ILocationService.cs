using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WeatherPlatform.Domain.Dtos;

namespace WeatherPlatform.Infrastructure.Interfaces
{
    public interface ILocationService
    {
        Task<WeatherResponseDto> CreateLocation(string city);
    }
}
