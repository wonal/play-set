using Microsoft.AspNetCore.Mvc;
using Set.Api.Models;
using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetController : Controller
    {
        private static readonly Games GameHolder = new Games();
        private static readonly object dbLockObject = new object();

        [HttpGet("newgame")]
        public BoardDTO GetBoard()
        {
            Guid id = GameHolder.CreateGame();
            BoardDTO boardDTO = new BoardDTO
            {
                GameID = id,
                Cards = GameHolder.RetrieveGame(id).GameObj.Board,
                TopScores = new List<Player>()
            };

            using (PlayerContext context = new PlayerContext())
            {
                List<Player> player = context.Players.OrderBy(p => p.Time).Take(5).ToList();
                boardDTO.TopScores = player;
            }

            return boardDTO;
        }

        [HttpGet("markstart/{id}")]
        public ActionResult StartStopwatch(Guid id)
        {
            GameResult gameResult = GameHolder.RetrieveGame(id);
            if (!gameResult.Success)
            {
                return BadRequest();
            }

            Game game = gameResult.GameObj;
            if(game.GameStarted)
            {
                return BadRequest();
            }

            game.GameTime.MarkStart();
            game.GameStarted = true;
            return Ok();
        }

        [HttpPost("validate")]
        public IActionResult PostSelectedCards(GuessDTO guess)
        {
            GameResult gameResult = GameHolder.RetrieveGame(guess.GameID);
            if (!gameResult.Success)
            {
                return BadRequest();
            }

            Game game = gameResult.GameObj;
            if (!game.ValidCards(guess.Card1, guess.Card2, guess.Card3) || game.WinState)
            {
                return BadRequest();
            }

            game.MakeGuess(guess.Card1, guess.Card2, guess.Card3);
            GameDTO gameDTO = new GameDTO
            {
                GameID = guess.GameID,
                Board = game.Board,
                ValidSet = game.ValidSet,
                WinState = game.WinState,
                CardsRemaining = game.CardsRemaining,
                TopScores = new List<Player>()
            };

            return Ok(gameDTO);
        }

        [HttpPost("markend")]
        public IActionResult PostWinningPlayer(WinnerDTO winner)
        {
            GameResult gameResult = GameHolder.RetrieveGame(winner.GameID);
            if (!gameResult.Success)
            {
                return BadRequest();
            }

            Game game = gameResult.GameObj;
            if(!game.WinState || game.InDatabase)
            {
                return BadRequest();
            }

            int time = game.GameTime.GetTotalTime();
            WinnerDTO winnerDTO = new WinnerDTO
            {
                GameID = winner.GameID,
                PlayerName = winner.PlayerName,
                GameTime = time,
                TopScores = new List<Player>()
            };

            lock (dbLockObject)
            {
                using (PlayerContext context = new PlayerContext())
                {
                    List<Player> players = context.Players.ToList();
                    context.Add(new Player { Name = winner.PlayerName, Time = time });
                    context.SaveChanges();
                    List<Player> player = context.Players.OrderBy(p => p.Time).Take(5).ToList();
                    winnerDTO.TopScores = player;
                    game.InDatabase = true;
                }
            }
            return Ok(winnerDTO);
        }
    }
}
