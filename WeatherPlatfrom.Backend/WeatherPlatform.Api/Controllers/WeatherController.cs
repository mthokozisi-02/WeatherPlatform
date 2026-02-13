using Microsoft.AspNetCore.Mvc;
using WeatherPlatform.Infrastructure.Interfaces;

namespace WeatherPlatform.Api.Controllers
{
    [ApiController]
    [Route("api/")]
    public class WeatherController(IWeatherService weatherService) : Controller
    {
        private readonly IWeatherService _weatherService = weatherService;

        [HttpGet("current-weather")]
        public async Task<IActionResult> GetCurrentWeather([FromQuery] string city)
        {
            return Ok(await _weatherService.GetCurrentWeather(city));
        }

        [HttpPost("refresh-weather")]
        public async Task<IActionResult> RefreshWeather(int locationId)
        {
            return Ok(await _weatherService.RefreshWeather(locationId));
        }
    }
}
