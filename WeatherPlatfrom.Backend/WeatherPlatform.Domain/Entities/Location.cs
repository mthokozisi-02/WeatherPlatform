using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherPlatform.Domain.Entities
{
    public class Location : BaseEntity
    {
        public string City { get; set; }
        public string Country { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool IsFavorite { get; set; } = false;
        public DateTime? LastSyncedAt { get; set; }

        public ICollection<WeatherSnapshot> WeatherSnapshots = new List<WeatherSnapshot>();
        public ICollection<ForecastSnapshot> ForecastSnapshots = new List<ForecastSnapshot>();
    }
}
