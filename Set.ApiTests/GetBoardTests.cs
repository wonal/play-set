using Newtonsoft.Json;
using NUnit.Framework;
using Set.Api.Models;
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
        [Test]
        public async Task TestStartingBoard()
        {
            HttpClient client = TestUtilities.GetHttpClient();
            SeedDTO seed = new SeedDTO { Seed = 42 };
            StringContent postContent = TestUtilities.ObjToStringContent(seed);

            HttpResponseMessage response = await client.PostAsync("newgame", postContent);
            string content = await response.Content.ReadAsStringAsync();
            List<Card> board = JsonConvert.DeserializeObject<BoardDTO>(content).Cards;

            Assert.AreEqual(12, board.Count, "Actual board count does not equal expected count of 12 cards");
            Assert.IsTrue(Game.BoardContainsSet(board), "Starting board does not contain a set");
        }
    }
}
