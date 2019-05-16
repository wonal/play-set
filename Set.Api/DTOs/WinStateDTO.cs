using SetApi.Models;
using System;
using System.Collections.Generic;

namespace Set.Api.DTOs
{
    public class WinStateDTO
    {
        public Guid GameID { get; set; }
        public string PlayerName { get; set; }
        public int GameTime { get; set; }
        public List<Player> TopScores { get; set; }
    }
}
