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
        public BoardDTO GetBoard()
        {
            int id = GameHolder.CreateGame();
            return new BoardDTO
            {
                GameID = id,
                Cards = GameHolder.RetrieveGame(id).Board,
            };
        }

        [HttpGet("newgame/{id}")]
        public BoardDTO NewGame(int id)
        {
            GameHolder.RetrieveGame(id).CreateGame();
            Game game = GameHolder.RetrieveGame(id);
            return new BoardDTO
            {
                GameID = id,
                Cards = game.Board,
            };
        }

        [HttpPost("validate")]
        public GameDTO PostSelectedCards(BoardDTO state)
        {
            GameHolder.RetrieveGame(state.GameID).MakeGuess(state.Cards.ElementAt(0), state.Cards.ElementAt(1), state.Cards.ElementAt(2));
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
