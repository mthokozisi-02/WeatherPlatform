using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherPlatform.Domain.Dtos
{
    public class WeatherResponseDto
    {
        public MainInfo main { get; set; } = null!;
        public WeatherInfo[] weather { get; set; } = null!;
        public SystemInfo sys { get; set; } = null!;
        public Coordinates coord { get; set; } = null!;

        public class MainInfo
        {
            public decimal temp { get; set; }
            public int humidity { get; set; }
        }

        public class WeatherInfo
        {
            public string description { get; set; } = null!;

        }

        public class SystemInfo
        {
            public string country { get; set; } = null!;
        }

        public class Coordinates
        {
            public double lat { get; set; }
            public double lon { get; set; }
        }
    }
}
