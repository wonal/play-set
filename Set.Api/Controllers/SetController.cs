using System.Collections.Generic;
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

        [HttpPost("validate")]
        public (bool, List<Card>) PostSelectedCards(IEnumerable<Card> cards)
        {
            return GameState.MakeGuess(cards.ElementAt(0), cards.ElementAt(1), cards.ElementAt(2));
        }
    }
}
