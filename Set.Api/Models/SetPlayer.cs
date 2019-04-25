using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Set.Api.Models
{
    public class SetPlayer
    {
        public Game game { get; }

        public SetPlayer()
        {
            game = new Game();
        }

        public Game MakeGuess(Card card1, Card card2, Card card3)
        {
            game.MakeGuess(card1, card2, card3);
            return game;
        }
    }
}
