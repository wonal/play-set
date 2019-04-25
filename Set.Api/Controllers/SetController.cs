using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Set.Api.Models;
using SetApi.Models;



namespace SetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetController : Controller
    {
        private static SetPlayer GameState = new SetPlayer();

        [HttpGet("board")]
        public List<Card> GetBoard()
        {
            return GameState.game.Board;
        }

        [HttpPost("validate")]
        public Game PostSelectedCards(IEnumerable<Card> cards)
        {
            return GameState.MakeGuess(cards.ElementAt(0), cards.ElementAt(1), cards.ElementAt(2));
        }
    }
}
