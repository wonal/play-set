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
    class GetBoardTests
    {
        private readonly string url = "http://localhost:5000/api/set";
        private List<Card> board;

        [SetUp]
        public async Task TestSetup()
        {
            using (HttpClient client = new HttpClient())
            {
                Seed seed = new Seed { HasSeed = true, SeedValue = 42 };
                string seedObj = JsonConvert.SerializeObject(seed);
                StringContent postContent = new StringContent(seedObj, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(url + "/newgame", postContent);
                string content = await response.Content.ReadAsStringAsync();
                board = JsonConvert.DeserializeObject<BoardDTO>(content).Cards;
            }
        }

        [Test]
        public void TestStartingBoardHas12Cards()
        {
            Assert.AreEqual(12, board.Count);
        }

        [Test]
        public void TestStartingBoardContainsSet()
        {
            Assert.IsTrue(Game.BoardContainsSet(board));
        }
    }
}
