using System.Collections.Generic;
using System;

namespace SetApi.Models
{
    public class Games
    {
        private Dictionary<int, Guid> gameIDs;
        private int numGames;
        private readonly object lockObject = new object();
        public Dictionary<Guid, Game> GamesList;

        public Games()
        {
            gameIDs = new Dictionary<int, Guid>();
            GamesList = new Dictionary<Guid, Game>();
            numGames = 0;
        }

        public Guid CreateGame()
        {
            lock (lockObject)
            {
                Game game = new Game();
                UpdateGameID();
                Guid guid = Guid.NewGuid();
                gameIDs.Add(numGames, guid);
                GamesList.Add(guid, game);
                return guid;
            }
        }

        private void UpdateGameID()
        {
            if (numGames > 1000)
            {
                numGames = 0;
            }
            numGames += 1;
            return;
        }

        public Game RetrieveGame(Guid id)
        {
            return GamesList[id];
        }
    }
}
