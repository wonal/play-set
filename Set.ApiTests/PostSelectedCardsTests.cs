using Newtonsoft.Json;
using NUnit.Framework;
using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Set.ApiTests
{
    class PostSelectedCardsTests
    {
        private readonly string url = "http://localhost:5000/api/set";
        private List<Card> FindSet(List<Card> board)
        {
            int length = board.Count;
            List<Card> set = new List<Card>();
            for (int i = 0; i < length-2; i++)
            {
                for(int j = i+1; j < length-1; j++)
                {
                    for (int k = j+1; k < length; k++)
                    {
                        if (Game.IsSet(board[i], board[j], board[k]))
                        {
                            set.Add(board[i]);
                            set.Add(board[j]);
                            set.Add(board[k]);
                            return set;
                        }
                    }
                }
            }
            return set;
        }

        [Test]
        public async Task TestPostingValidSetRegistersBoolean()
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.GetAsync(url + "/newgame");
                string content = await response.Content.ReadAsStringAsync();
                BoardDTO gameObj = JsonConvert.DeserializeObject<BoardDTO>(content);
                List<Card> cards = FindSet(gameObj.Cards);
                GuessDTO guess = new GuessDTO { GameID = gameObj.GameID, Card1 = cards[0], Card2 = cards[1], Card3 = cards[2] };
                string guessObj = JsonConvert.SerializeObject(guess);

                StringContent guessContent = new StringContent(guessObj, Encoding.UTF8, "application/json");
                HttpResponseMessage postResponse = await client.PostAsync(url + "/validate", guessContent);
                string postContent = await postResponse.Content.ReadAsStringAsync();
                GameDTO gameDTO = JsonConvert.DeserializeObject<GameDTO>(postContent);
                Assert.AreEqual(true, gameDTO.ValidSet);
            }
        }
    }
}
