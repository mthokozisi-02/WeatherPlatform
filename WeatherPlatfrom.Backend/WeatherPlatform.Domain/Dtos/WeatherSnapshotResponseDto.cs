using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherPlatform.Domain.Dtos
{
    public class WeatherSnapshotResponseDto
    {
        public string City { get; set; }
        public string Country { get; set; }
        public double latitude { get; set; }
        public double longitude { get; set; }
        public decimal Temp { get; set; }
        public int Humidity { get; set; }
        public string Description { get; set; }
        public bool IsFavorite { get; set; }
        public DateTime LastSyncedAt { get; set; }
    }
}
