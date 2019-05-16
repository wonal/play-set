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
        public int PlayerID { get; private set; }

        public GameHandler()
        {
            gameCounter = new Dictionary<int, Guid>();
            idToGame = new Dictionary<Guid, Game>();
            gameNum = 0;
        }

        public Guid CreateGame(Seed seedObj)
        {
            lock (lockObject)
            {
                Game game = seedObj.HasSeed ? new Game(seedObj.SeedValue) : new Game();
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
            if (gameNum > 1000)
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
                    Success = true,
                    Error = "",
                    GameObj = idToGame[id]
                };
            }
            else
            {
                return new GameResult
                {
                    Success = false,
                    Error = "Game ID not valid",
                };
            }
        }
    }
}
