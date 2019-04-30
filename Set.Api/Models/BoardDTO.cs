using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetApi.Models
{
    public class BoardDTO
    {
        public int GameID { get; set; }
        public List<Card> Cards { get; set; }
    }
}
