using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetApi.Models
{
    public class Games
    {
        public Dictionary<int, Game> GamesList;
        private int gameID;

        public Games()
        {
            GamesList = new Dictionary<int, Game>();
            gameID = 0;
        }

        public int CreateGame()
        {
            Game game = new Game();
            UpdateGameID();
            GamesList.Add(gameID, game);
            return gameID;
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
