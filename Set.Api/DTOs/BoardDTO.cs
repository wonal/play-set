﻿using System;
using System.Collections.Generic;

namespace SetApi.Models
{
    public class BoardDTO
    {
        public Guid GameID { get; set; }
        public int SeedValue { get; set; }
        public List<Card> Cards { get; set; }
        public List<Player> TopScores { get; set; }
        public List<Player> DailyScores { get; set; }
        public int CardsRemaining { get; set; }
        public DisplayVersion Version { get; set; }
    }
}
