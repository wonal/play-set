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
            gameID += 1;
            GamesList.Add(gameID, game);
            return gameID;
        }

        public Game RetrieveGame(int id)
        {
            return GamesList[id];
        }
    }
}
