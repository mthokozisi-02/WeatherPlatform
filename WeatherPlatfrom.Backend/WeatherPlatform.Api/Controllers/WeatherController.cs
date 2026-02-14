using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using WeatherPlatform.Domain.Dtos;
using WeatherPlatform.Infrastructure.Interfaces;

namespace WeatherPlatform.Api.Controllers
{
    [EnableRateLimiting("fixed")]
    [ApiController]
    [Route("api/")]
    public class WeatherController(IWeatherService weatherService) : Controller
    {
        private readonly IWeatherService _weatherService = weatherService;

        [HttpPost("current-weather")]
        public async Task<IActionResult> GetCurrentWeather([FromBody] CreateLocationDto city)
        {
            return Ok(await _weatherService.GetCurrentWeather(city.Name));
        }

        [HttpPost("refresh-weather")]
        public async Task<IActionResult> RefreshWeather([FromBody] int locationId)
        {
            return Ok(await _weatherService.RefreshWeather(locationId));
        }

        [HttpPost("current-forecast")]
        public async Task<IActionResult> GetForecast([FromBody] CreateLocationDto city)
        {
            return Ok(await _weatherService.GetForecast(city.Name));
        }

        [HttpPost("refresh-forecast")]
        public async Task<IActionResult> RefreshForecast(int locationId)
        {
            return Ok(await _weatherService.RefreshForecast(locationId));
        }
    }
}
