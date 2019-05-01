using System.Collections.Generic;

namespace SetApi.Models
{
    public class BoardDTO
    {
        public int GameID { get; set; }
        public List<Card> Cards { get; set; }
    }
}
