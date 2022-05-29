using System.Collections.Generic;
using System;
using Set.Api.Models;

namespace SetApi.Models
{
    public class GameHandler
    {
        private readonly Dictionary<int, Guid> gameCounter;
        private readonly Dictionary<Guid, Game> idToGame;
        private int gameNum;
        private readonly object lockObject = new object();

        public GameHandler()
        {
            gameCounter = new Dictionary<int, Guid>();
            idToGame = new Dictionary<Guid, Game>();
            gameNum = 0;
        }

        public (Game, Guid) GetGame(NewGameDTO newGameDTO)
        {
            if (newGameDTO.GameId.HasValue)
            {
                var gameResult = RetrieveGame(newGameDTO.GameId.Value);
                if (
                    gameResult.ValidGameID &&
                    gameResult.GameObj.GameDay.ToShortDateString() == newGameDTO.UserLocalDateTime.ToShortDateString() &&
                    !gameResult.GameObj.WinState)
                {
                    return (gameResult.GameObj, newGameDTO.GameId.Value);
                }
            }

            var gameId = CreateGame(newGameDTO.IsDaily ? DailyGames.GetSeed(newGameDTO.UserLocalDateTime) : null, newGameDTO.UserLocalDateTime);
            return (RetrieveGame(gameId).GameObj, gameId);
        }

        public Guid CreateGame(int? seed, DateTime gameDay)
        {
            lock (lockObject)
            {
                Game game = seed.HasValue ? new Game(seed.Value, gameDay) : new Game(null, gameDay);
                UpdateGameID();
                if (gameCounter.ContainsKey(gameNum))
                {
                    Guid oldGuid = gameCounter[gameNum];
                    idToGame.Remove(oldGuid);
                }
                Guid guid = Guid.NewGuid();
                gameCounter[gameNum] = guid;
                idToGame[guid] = game;
                return guid;
            }
        }

        private void UpdateGameID()
        {
            if (gameNum > 10000)
            {
                gameNum = 0;
            }
            gameNum += 1;
            return;
        }

        public GameResult RetrieveGame(Guid id)
        {
            if (idToGame.ContainsKey(id))
            {
                return new GameResult
                {
                    ValidGameID = true,
                    Error = "",
                    GameObj = idToGame[id]
                };
            }
            else
            {
                return new GameResult
                {
                    ValidGameID = false,
                    Error = "Game ID not valid",
                };
            }
        }
    }
}
