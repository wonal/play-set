using SetApi.Models;
using System;

namespace Set.Api.Multiplayer.DTOs
{
    public class GuessDTO
    {
        public string GameID { get; set; }
        public Card Card1 { get; set; }
        public Card Card2 { get; set; }
        public Card Card3 { get; set; }
    }
}
