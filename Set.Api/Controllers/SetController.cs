﻿using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SetApi.Models;



namespace SetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetController : Controller
    {
        private static Game GameState = new Game();

        [HttpGet("board")]
        public List<Card> GetBoard()
        {
            return GameState.Board;
        }

        [HttpGet("newgame")]
        public List<Card> NewGame()
        {
            return GameState.ReturnNewGame();
        }

        [HttpPost("validate")]
        public Game PostSelectedCards(IEnumerable<Card> cards)
        {
            GameState.MakeGuess(cards.ElementAt(0), cards.ElementAt(1), cards.ElementAt(2));
            return GameState;
        }
    }
}
