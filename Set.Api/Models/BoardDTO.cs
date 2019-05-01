using System;
using System.Collections.Generic;

namespace SetApi.Models
{
    public class BoardDTO
    {
        public Guid GameID { get; set; }
        public List<Card> Cards { get; set; }
    }
}
