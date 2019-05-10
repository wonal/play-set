using System;
using System.Collections.Generic;

namespace SetApi.Models
{
    public class GameDTO
    {
        public Guid GameID { get; set; }
        public List<Card> Board { get; set; }
        public bool ValidSet { get; set; }
        public bool WinState { get; set; }
        public int CardsRemaining { get; set; }
        public int Time { get; set; }
        public string PlayerName { get; set; }
        public List<Player> TopScores { get; set; }
    }
}
