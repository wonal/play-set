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
            Assert.AreEqual(new Card(Characteristic.Option3, Characteristic.Option2, Characteristic.Option3, Characteristic.Option3), board[0],"first card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option2, Characteristic.Option3), board[1],"second card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option3, Characteristic.Option1, Characteristic.Option1, Characteristic.Option3), board[2],"third card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option3, Characteristic.Option1, Characteristic.Option2, Characteristic.Option1), board[3],"fourth card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option3, Characteristic.Option2, Characteristic.Option2, Characteristic.Option3), board[4],"fifth card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option2, Characteristic.Option3, Characteristic.Option3, Characteristic.Option2), board[5],"sixth card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option2, Characteristic.Option1), board[6],"seventh card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option1, Characteristic.Option1), board[7],"eighth card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option3, Characteristic.Option1), board[8],"ninth card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option2, Characteristic.Option3, Characteristic.Option3, Characteristic.Option3), board[9],"tenth card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option3, Characteristic.Option2, Characteristic.Option1, Characteristic.Option3), board[10],"eleventh card does not match seeded card");
            Assert.AreEqual(new Card(Characteristic.Option2, Characteristic.Option3, Characteristic.Option2, Characteristic.Option1), board[11],"twelfth card does not match seeded card");
        }
    }
}
