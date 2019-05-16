using Newtonsoft.Json;
using NUnit.Framework;
using Set.Api.DTOs;
using Set.Api.Models;
using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Set.ApiTests
{
    class WinAndResetTests
    {
        private GameDTO gameDTO;
        private WinStateDTO winStateDTO;

        [SetUp]
        public async Task TestSetup()
        {
            SeedDTO seed = new SeedDTO { Seed = 42 };
            StringContent postContent = TestUtilities.ObjToStringContent(seed);
            HttpClient client = TestUtilities.GetHttpClient();

            HttpResponseMessage response = await client.PostAsync("newgame", postContent);
            string content = await response.Content.ReadAsStringAsync();
            BoardDTO gameObj = JsonConvert.DeserializeObject<BoardDTO>(content);
            gameDTO = new GameDTO { Board = gameObj.Cards, GameID = gameObj.GameID };

            for (int i = 0; i < 24; i++)
            {
                List<Card> cards = TestUtilities.FindSet(gameDTO.Board);
                GuessDTO guess = new GuessDTO { GameID = gameDTO.GameID, Card1 = cards[0], Card2 = cards[1], Card3 = cards[2] };
                StringContent guessContent = TestUtilities.ObjToStringContent(guess);

                HttpResponseMessage postResponse = await client.PostAsync("submitguess", guessContent);
                string responseContent = await postResponse.Content.ReadAsStringAsync();
                gameDTO = JsonConvert.DeserializeObject<GameDTO>(responseContent);
            }
        }

        [Test]
        public async Task TestWinState()
        {
            HttpClient client = TestUtilities.GetHttpClient();
            WinnerDTO win = new WinnerDTO { GameID = gameDTO.GameID, PlayerName = "test" };
            StringContent winContent = TestUtilities.ObjToStringContent(win);

            HttpResponseMessage postResponse = await client.PostAsync("postwin", winContent);
            string responseContent = await postResponse.Content.ReadAsStringAsync();
            winStateDTO = JsonConvert.DeserializeObject<WinStateDTO>(responseContent);

            Assert.IsTrue(gameDTO.WinState, "Win state is not true");
            Assert.NotZero(winStateDTO.GameTime, "Expected a game time above zero");
            Assert.AreEqual(gameDTO.CardsRemaining, 9, "Expected 9 cards remaining");
        }

        [Test]
        public async Task TestRepeatRequestToEndResultsIn400()
        {
            HttpClient client = TestUtilities.GetHttpClient();
            WinnerDTO win = new WinnerDTO { GameID = gameDTO.GameID, PlayerName = "test"};
            StringContent winContent = TestUtilities.ObjToStringContent(win);

            HttpResponseMessage postResponse1 = await client.PostAsync("postwin", winContent);
            HttpResponseMessage postResponse2 = await client.PostAsync("postwin", winContent);
            Assert.AreEqual(HttpStatusCode.BadRequest, postResponse2.StatusCode);
        }

        [Test]
        public async Task TestReset()
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
            gameDTO = JsonConvert.DeserializeObject<GameDTO>(responseContent);

            Assert.IsFalse(gameDTO.WinState, "After a reset, game marked as won still");
            Assert.AreEqual(78, gameDTO.CardsRemaining, "After a reset, expected 78 cards remaining but actual was different");
        }
    }
}
