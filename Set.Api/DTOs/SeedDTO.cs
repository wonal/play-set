
using System;

namespace Set.Api.Models
{
    public class NewGameDTO
    {
        public bool IsDaily { get; set; }
        public DateTime? UserLocalTime { get; set; }
        public Guid? GameId { get; set; }
    }
}
