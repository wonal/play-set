using Newtonsoft.Json;
using NUnit.Framework;
using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Set.ApiTests
{
    class GetBoardTests
    {
        private readonly string url = "http://localhost:5000/api/set";

        [Test]
        public async Task TestStartingBoardHas12Cards()
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.GetAsync(url + "/newgame");
                string content = await response.Content.ReadAsStringAsync();
                List<Card> board = JsonConvert.DeserializeObject<BoardDTO>(content).Cards;
                Assert.AreEqual(12, board.Count);
            }
        }

        [Test]
        public async Task TestStartingBoardContainsSet()
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.GetAsync(url + "/newgame");
                string content = await response.Content.ReadAsStringAsync();
                List<Card> board = JsonConvert.DeserializeObject<BoardDTO>(content).Cards;
                Assert.IsTrue(Game.BoardContainsSet(board));
            }
        }
    }
}
