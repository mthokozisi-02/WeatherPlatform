using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using WeatherPlatform.Domain.Dtos;
using WeatherPlatform.Infrastructure.Interfaces;

namespace WeatherPlatform.Api.Controllers
{
    [EnableRateLimiting("fixed")]
    [ApiController]
    [Route("api/")]
    public class LocationController(ILocationService locationService) : Controller
    {
        private readonly ILocationService _locationService = locationService;

        [HttpPost("create-location")]
        public async Task<IActionResult> CreateLocation(string city)
        {
            return Ok(await _locationService.CreateLocation(city));
        }

        [HttpPut("update-location")]
        public async Task<IActionResult> UpdateLocation(UpdateLocationDto update)
        {
            return Ok(await _locationService.UpdateLocation(update));
        }

        [HttpDelete("delete-location/{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            return Ok(await _locationService.DeleteLocation(id));
        }

        [HttpGet("get-all-locations")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _locationService.GetAll());
        }
    }
}
