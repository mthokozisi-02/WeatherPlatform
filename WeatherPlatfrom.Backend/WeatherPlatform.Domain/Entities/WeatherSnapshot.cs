using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherPlatform.Domain.Entities
{
    public class WeatherSnapshot : BaseEntity
    {
        public int LocationId { get; set; }
        public Location Location { get; set; }

        public decimal Temperature { get; set; }
        public string? Description { get; set; }
        public int Humidity { get; set; }
    }
}
