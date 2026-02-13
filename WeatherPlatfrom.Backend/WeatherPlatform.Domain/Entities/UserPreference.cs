using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeatherPlatform.Domain.Entities
{
    public class UserPreference : BaseEntity
    {
        public string Units { get; set; }
        public int RefreshIntervalMinutes { get; set; }
    }
}
