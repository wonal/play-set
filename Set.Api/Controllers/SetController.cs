using Microsoft.AspNetCore.Mvc;
using SetApi.Models;
using System;

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
            Guid id = GameHolder.CreateGame();
            return new BoardDTO
            {
                GameID = id,
                Cards = GameHolder.RetrieveGame(id).Board,
            };
        }

        [HttpGet("newgame/{id}")]
        public BoardDTO NewGame(Guid id)
        {
            GameHolder.RetrieveGame(id).CreateGame();
            Game game = GameHolder.RetrieveGame(id);
            return new BoardDTO
            {
                GameID = id,
                Cards = game.Board,
            };
        }

        [HttpGet("markstart/{id}")]
        public ActionResult StartStopwatch(Guid id)
        {
            Game game = GameHolder.RetrieveGame(id);
            string startingDisplay = game.GameTime.GetTotalTime();
            game.GameTime.MarkStart();
            return Content(startingDisplay, "text/plain");
        }

        [HttpPost("validate")]
        public GameDTO PostSelectedCards(GuessDTO guess)
        {
            GameHolder.RetrieveGame(guess.GameID).MakeGuess(guess.Card1, guess.Card2, guess.Card3);
            Game game = GameHolder.RetrieveGame(guess.GameID);
            return new GameDTO
            {
                GameID = guess.GameID,
                Board = game.Board,
                ValidSet = game.ValidSet,
                WinState = game.WinState,
                CardsRemaining = game.CardsRemaining,
                Time = game.GameTime.GetTotalTime()
            };
        }
    }
}
