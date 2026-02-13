using AutoMapper;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using WeatherPlatform.Domain.Dtos;
using WeatherPlatform.Infrastructure.Interfaces;

namespace WeatherPlatform.Infrastructure.Services
{
    public class WeatherService(HttpClient httpClient, IConfiguration configuration) : IWeatherService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly IConfiguration _configuration = configuration;

        public async Task<WeatherResponseDto> GetCurrentWeather(string city)
        {
            var apiKey = _configuration["WeatherApi:ApiKey"];

            var response = await _httpClient.GetAsync($"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric");

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                throw new Exception("City not found");
            }

            if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
            {
                throw new Exception("API rate limit exceeded");
            }

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("External weather service unavailable");
            }

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<WeatherResponseDto>(content)!;
        }
    }
}
