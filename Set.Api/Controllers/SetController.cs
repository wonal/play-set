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
        private static readonly Games GameHolder = new Games();

        [HttpGet("initgame")]
        public GameDTO GetBoard()
        {
            int id = GameHolder.CreateGame();
            return new GameDTO
            {
                GameID = id,
                Board = GameHolder.RetrieveGame(id).Board,
                ValidSet = false,
                WinState = false,
                CardsRemaining = 81
            };
        }

        [HttpGet("newgame/{id}")]
        public GameDTO NewGame(int id)
        {
            GameHolder.RetrieveGame(id).CreateGame();
            Game game = GameHolder.RetrieveGame(id);
            return new GameDTO
            {
                GameID = id,
                Board = game.Board,
                ValidSet = false,
                WinState = false,
                CardsRemaining = 81
            };
        }

        [HttpPost("validate")]
        public GameDTO PostSelectedCards(GameDTO state)
        {
            GameHolder.RetrieveGame(state.GameID).MakeGuess(state.Board.ElementAt(0), state.Board.ElementAt(1), state.Board.ElementAt(2));
            Game game = GameHolder.RetrieveGame(state.GameID);
            return new GameDTO
            {
                GameID = state.GameID,
                Board = game.Board,
                ValidSet = game.ValidSet,
                WinState = game.WinState,
                CardsRemaining = game.CardsRemaining
            };
        }
    }
}
