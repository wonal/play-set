using System.Collections.Generic;

namespace SetApi.Models
{
    public class Games
    {
        public Dictionary<int, Game> GamesList;
        private int gameID;
        private readonly object lockObject = new object();

        public Games()
        {
            GamesList = new Dictionary<int, Game>();
            gameID = 0;
        }

        public int CreateGame()
        {
            lock (lockObject)
            {
                Game game = new Game();
                UpdateGameID();
                GamesList.Add(gameID, game);
                return gameID;
            }
        }

        private void UpdateGameID()
        {
            if (gameID > 1000)
            {
                gameID = 0;
            }
            gameID += 1;
            return;
        }

        public Game RetrieveGame(int id)
        {
            return GamesList[id];
        }
    }
}
