
using System;

namespace SetApi.Models
{
    public class GuessDTO
    {
        public Guid GameID { get; set; }
        public string PlayerName { get; set; }
        public Card Card1 { get; set; }
        public Card Card2 { get; set; }
        public Card Card3 { get; set; }
    }
}
