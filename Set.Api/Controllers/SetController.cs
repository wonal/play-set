using Microsoft.AspNetCore.Mvc;
using Set.Api.DTOs;
using Set.Api.Models;
using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using Dapper;
using Microsoft.Data.Sqlite;

namespace SetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetController : Controller
    {
        private static readonly GameHandler GameHolder = new GameHandler();
        private static readonly object dbLockObject = new object();
        private IConfiguration config;
        private string connectionString;
        /*
        private readonly PlayerContext context;

        public SetController(PlayerContext playerContext)
        {
            context = playerContext;
        }
        */
        public SetController(IConfiguration configuration)
        {
            config = configuration;
            connectionString = $"Data Source={config["DBPath"]}playercontext.db";
        }


        [HttpPost("newgame")]
        public BoardDTO GetBoard(SeedDTO seedDTO)
        {
            Guid id = GameHolder.CreateGame(seedDTO.Seed);
            Game game = GameHolder.RetrieveGame(id).GameObj;
            var boardDTO = new BoardDTO
            {
                GameID = id,
                SeedValue = game.SeedValue,
                Cards = game.Board
            };

            using (var connection = new SqliteConnection(connectionString))
            {
                connection.Open();
                boardDTO.TopScores = connection.Query<Player>("Select * From Players Order By Time Limit 5").ToList();
            }

            return boardDTO;
        }

        [HttpGet("markstart/{id}")]
        public ActionResult StartStopwatch(Guid id)
        {
            GameResult gameResult = GameHolder.RetrieveGame(id);
            if (!gameResult.ValidGameID)
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
            return Ok( new TimeDTO { StartTime = game.GameTime.StartTime.ToUnixTimeMilliseconds() });
        }

        [HttpPost("submitguess")]
        public IActionResult PostSelectedCards(GuessDTO guess)
        {
            GameResult gameResult = GameHolder.RetrieveGame(guess.GameID);
            if (!gameResult.ValidGameID)
            {
                return BadRequest();
            }

            Game game = gameResult.GameObj;
            if (!game.ValidCards(guess.Card1, guess.Card2, guess.Card3) || game.WinState)
            {
                return BadRequest();
            }

            bool validSet = game.MakeGuess(guess.Card1, guess.Card2, guess.Card3);

            return Ok(new GameDTO
            {
                GameID = guess.GameID,
                Board = game.Board,
                ValidSet = validSet,
                WinState = game.WinState,
                CardsRemaining = game.CardsRemaining,
                TopScores = new List<Player>()
            });
        }

        [HttpPost("postwin")]
        public IActionResult PostWinningPlayer(WinnerDTO winner)
        {
            GameResult gameResult = GameHolder.RetrieveGame(winner.GameID);
            if (!gameResult.ValidGameID)
            {
                return BadRequest();
            }

            Game game = gameResult.GameObj;
            if(!game.WinState || game.WinRecorded)
            {
                return BadRequest();
            }

            int time = game.GameTime.GetTotalTime();
            var winStateDTO = new WinStateDTO
            {
                GameID = winner.GameID,
                PlayerName = winner.PlayerName,
                GameTime = time,
            };

            lock (dbLockObject)
            {
                using (var connection = new SqliteConnection(connectionString))
                {
                    connection.Open();

                    if (game.SeedMode == false)
                    {
                        connection.Execute(@"Insert Into Players (Name, Time, Seed) Values (@Name, @Time, @Seed)",
                            new Player { Name = winner.PlayerName, Time = time, Seed = game.SeedValue });
                    }
                    winStateDTO.TopScores = connection.Query<Player>("Select * From Players Order By Time Limit 5").ToList();
                }
                game.WinRecorded = true;
            }
            return Ok(winStateDTO);
        }
    }
}
