﻿using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SetApi.Models;



namespace SetApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SetController : Controller
    {
        private static Game GameState = new Game();

        [HttpGet]
        [ActionName("board")]
        public List<Card> GetBoard()
        {
            return GameState.Board;
        }

        [HttpGet("{num}")]
        public List<Card> GetCards(int num)
        {
            return GameState.DrawCards(num);
        }

        [HttpPost]
        [ActionName("validate")]
        public bool PostSelectedCards(IEnumerable<Card> cards)
        {
            return Game.IsSet(cards.ElementAt(0), cards.ElementAt(1), cards.ElementAt(2));
        }

        [HttpPost]
        [ActionName("refill")]
        public List<Card> PostCardsToRefill(IEnumerable<Card> cards)
        {
            return GameState.RemoveAndRefill(cards.ElementAt(0), cards.ElementAt(1), cards.ElementAt(2));
        }
    }
}
