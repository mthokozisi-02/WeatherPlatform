using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WeatherPlatform.Domain.Entities;

namespace WeatherPlatform.Domain.Dtos
{
    public class UpdateLocationDto
    {
        public int Id { get; set; }
        public bool IsFavorite { get; set; }
    }
}
