using Newtonsoft.Json;
using NUnit.Framework;
using Set.Api.Models;
using SetApi.Models;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Set.ApiTests
{
    class PostValidSetTests
    {

        [Test]
        public async Task TestPostingValidSet()
        {
            SeedDTO seed = new SeedDTO { Seed = 42 };
            StringContent postContent = TestUtilities.ObjToStringContent(seed);
            HttpClient client = TestUtilities.GetHttpClient();

            HttpResponseMessage response = await client.PostAsync("newgame", postContent);
            string content = await response.Content.ReadAsStringAsync();
            BoardDTO gameObj = JsonConvert.DeserializeObject<BoardDTO>(content);

            List<Card> cards = TestUtilities.FindSet(gameObj.Cards);
            GuessDTO guess = new GuessDTO { GameID = gameObj.GameID, Card1 = cards[0], Card2 = cards[1], Card3 = cards[2] };
            StringContent guessContent = TestUtilities.ObjToStringContent(guess);

            HttpResponseMessage postResponse = await client.PostAsync("submitguess", guessContent);
            string responseContent = await postResponse.Content.ReadAsStringAsync();
            GameDTO gameDTO = JsonConvert.DeserializeObject<GameDTO>(responseContent);

            Assert.AreEqual(true, gameDTO.ValidSet, "Posted cards should have registered as valid but are invalid");
            Assert.AreEqual(78, gameDTO.CardsRemaining, "Cards remaining should have been 78 but are not");
            Assert.IsFalse(gameDTO.WinState, "Win state after a single POST should be false but is true");
            Assert.IsFalse(TestUtilities.BoardContainsCards(gameDTO.Board, guess.Card1, guess.Card2, guess.Card3), "Posted cards should be removed from the board but are still present");

        }
    }
}
