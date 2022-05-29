
using System;

namespace Set.Api.Models
{
    public class NewGameDTO
    {
        public bool IsDaily { get; set; }
        public string UserLocalTime { get; set; }
        public DateTime UserLocalDateTime => DateTime.Parse(UserLocalTime);
        public Guid? GameId { get; set; }
    }
}
