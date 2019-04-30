using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetApi.Models
{
    public class GameDTO
    {
        public int GameID { get; set; }
        public List<Card> Board { get; set; }
        public bool ValidSet { get; set; }
        public bool WinState { get; set; }
        public int CardsRemaining { get; set; }
    }
}
