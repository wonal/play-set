using System.Collections.Generic;
using System;

namespace SetApi.Models
{
    public class Games
    {
        private readonly Dictionary<int, Guid> gameCounter;
        private readonly Dictionary<Guid, Game> idToGame;
        private int gameNum;
        private readonly object lockObject = new object();

        public Games()
        {
            gameCounter = new Dictionary<int, Guid>();
            idToGame = new Dictionary<Guid, Game>();
            gameNum = 0;
        }

        public Guid CreateGame()
        {
            lock (lockObject)
            {
                Game game = new Game();
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

        public Game RetrieveGame(Guid id)
        {
            return idToGame[id];
        }
    }
}
