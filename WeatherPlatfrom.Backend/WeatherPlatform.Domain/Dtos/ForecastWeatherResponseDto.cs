using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherPlatform.Domain.Dtos
{
    public class ForecastWeatherResponseDto
    {
        public List<ForecastItem> list { get; set; } = new();

        public class ForecastItem
        {
            public MainInfo main { get; set; } = null!;
            public WeatherInfo[] weather { get; set; } = null!;
            public string dt_txt { get; set; }
            public long dt { get; set; }

            public class MainInfo
            {
                public decimal temp { get; set; }
                public int humidity { get; set; }
            }

            public class WeatherInfo
            {
                public string description { get; set; } = null!;
            }
        }
    }
}
