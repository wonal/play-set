using Microsoft.AspNetCore.Mvc;
using Set.Api.DTOs;
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
        private static readonly GameHandler GameHolder = new GameHandler();
        private static readonly object dbLockObject = new object();

        [HttpPost("newgame")]
        public BoardDTO GetBoard(SeedDTO seedDTO)
        {
            Seed seedObj = seedDTO.HasSeed ? new Seed(seedDTO.SeedValue) : new Seed();
            Guid id = GameHolder.CreateGame(seedObj);
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

        [HttpPost("submitguess")]
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

            var validSet = game.MakeGuess(guess.Card1, guess.Card2, guess.Card3);
            GameDTO gameDTO = new GameDTO
            {
                GameID = guess.GameID,
                Board = game.Board,
                ValidSet = validSet,
                WinState = game.WinState,
                CardsRemaining = game.CardsRemaining,
                TopScores = new List<Player>()
            };

            return Ok(gameDTO);
        }

        [HttpPost("postwin")]
        public IActionResult PostWinningPlayer(WinnerDTO winner)
        {
            GameResult gameResult = GameHolder.RetrieveGame(winner.GameID);
            if (!gameResult.Success)
            {
                return BadRequest();
            }

            Game game = gameResult.GameObj;
            if(!game.WinState || game.WinRecorded)
            {
                return BadRequest();
            }

            int time = game.GameTime.GetTotalTime();
            WinStateDTO winStateDTO = new WinStateDTO
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
                    if(!game.SeedMode.HasSeed)
                    {
                        List<Player> players = context.Players.ToList();
                        context.Add(new Player { Name = winner.PlayerName, Time = time });
                        context.SaveChanges();
                    }
                    List<Player> player = context.Players.OrderBy(p => p.Time).Take(5).ToList();
                    winStateDTO.TopScores = player;
                    game.WinRecorded = true;
                }
            }
            return Ok(winStateDTO);
        }
    }
}
