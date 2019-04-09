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

        [HttpGet("{num}")]
        public List<Card> GetCards(int num)
        {
            return GameState.DrawCards(num);
        }

        // POST api/<controller>
        [HttpPost]
        public bool PostSelectedCards(IEnumerable<Card> cards)
        {
            return Game.IsSet(cards.ElementAt(0), cards.ElementAt(1), cards.ElementAt(2));
        }


    }
}
