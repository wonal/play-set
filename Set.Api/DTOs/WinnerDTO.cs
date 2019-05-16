using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Set.Api.Models
{
    public class WinnerDTO
    {
        public Guid GameID { get; set; }
        public string PlayerName { get; set; }
        public int GameTime { get; set; }
        public List<Player> TopScores { get; set; }
    }
}
