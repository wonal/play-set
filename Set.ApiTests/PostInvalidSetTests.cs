using Newtonsoft.Json;
using NUnit.Framework;
using Set.Api.Models;
using SetApi.Models;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Set.ApiTests
{
    class PostInvalidSetTests
    {
        private GameDTO gameDTO;

        [SetUp]
        public async Task TestSetup()
        {
            Seed seed = new Seed { HasSeed = true, SeedValue = 42 };
            StringContent postContent = TestUtilities.ObjToStringContent(seed);
            HttpClient client = TestUtilities.GetHttpClient();

            HttpResponseMessage response = await client.PostAsync("newgame", postContent);
            string content = await response.Content.ReadAsStringAsync();
            BoardDTO gameObj = JsonConvert.DeserializeObject<BoardDTO>(content);
            gameDTO = new GameDTO { GameID = gameObj.GameID, Board = gameObj.Cards };
        }

        [Test]
        public async Task TestInvalidSet()
        {
            HttpClient client = TestUtilities.GetHttpClient();
            GuessDTO notASet = new GuessDTO { GameID = gameDTO.GameID, Card1 = gameDTO.Board[0], Card2 = gameDTO.Board[1], Card3 = gameDTO.Board[2] };
            StringContent guessContent = TestUtilities.ObjToStringContent(notASet);

            HttpResponseMessage postResponse = await client.PostAsync("validate", guessContent);
            string responseContent = await postResponse.Content.ReadAsStringAsync();
            gameDTO = JsonConvert.DeserializeObject<GameDTO>(responseContent);

            Assert.IsFalse(gameDTO.ValidSet, "Posted cards should have been an invalid set but are a valid set");
            Assert.IsTrue(TestUtilities.BoardContainsCards(gameDTO.Board, notASet.Card1, notASet.Card2, notASet.Card3), "The board no longer contains the invalid set cards");
        }
        
        [Test]
        public async Task TestInvalidSetNotOnBoard()
        {
            HttpClient client = TestUtilities.GetHttpClient();
            Card card1 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option1, Characteristic.Option1);
            Card card2 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option2, Characteristic.Option1);
            Card card3 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option3, Characteristic.Option1);
            GuessDTO notOnBoard = new GuessDTO { GameID = gameDTO.GameID, Card1 = card1, Card2 = card2, Card3 = card3 };
            StringContent guessContent = TestUtilities.ObjToStringContent(notOnBoard);
            HttpResponseMessage postResponse = await client.PostAsync("validate", guessContent);

            Assert.AreEqual(HttpStatusCode.BadRequest, postResponse.StatusCode);
        }

        [Test]
        public async Task Test400CodeForEarlyEndAttempt()
        {
            WinnerDTO fakedWin = new WinnerDTO { GameID = gameDTO.GameID, PlayerName = "anonymous", GameTime = 0, TopScores = new List<Player>() };
            StringContent winContent = TestUtilities.ObjToStringContent(fakedWin);

            HttpClient client = TestUtilities.GetHttpClient();
            HttpResponseMessage response = await client.PostAsync("markend", winContent);
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
