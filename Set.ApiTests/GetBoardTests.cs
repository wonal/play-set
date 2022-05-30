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
            var seed = new NewGameDTO { IsDaily = true, UserLocalTime = DateTime.Now.ToShortDateString() };
            StringContent postContent = TestUtilities.ObjToStringContent(seed);

            HttpResponseMessage response = await client.PostAsync("newgame", postContent);
            string content = await response.Content.ReadAsStringAsync();
            var board = JsonConvert.DeserializeObject<BoardDTO>(content);

            Assert.AreEqual(12, board.Cards.Count, "Actual board count does not equal expected count of 12 cards");
            Assert.AreEqual(81, board.CardsRemaining, "Actual board count does not equal expected count of 12 cards");
            Assert.IsTrue(Game.BoardContainsSet(board.Cards), "Starting board does not contain a set");
        }

        [Test]
        public async Task TestBoardInProgressReturnsAccurateCardCount()
        {
            HttpClient client = TestUtilities.GetHttpClient();
            var seed = new NewGameDTO { IsDaily = true, UserLocalTime = DateTime.Now.ToShortDateString() };
            StringContent postContent = TestUtilities.ObjToStringContent(seed);

            HttpResponseMessage response = await client.PostAsync("newgame", postContent);
            string content = await response.Content.ReadAsStringAsync();
            var board = JsonConvert.DeserializeObject<BoardDTO>(content);

            //make some guesses
            for (int i = 0; i < 5; i++)
            {
                List<Card> cards = TestUtilities.FindSet(board.Cards);
                GuessDTO guess = new GuessDTO { GameID = board.GameID, Card1 = cards[0], Card2 = cards[1], Card3 = cards[2] };
                StringContent guessContent = TestUtilities.ObjToStringContent(guess);
                HttpResponseMessage postResponse = await client.PostAsync("submitguess", guessContent);
                string responseContent = await postResponse.Content.ReadAsStringAsync();
                board.Cards = JsonConvert.DeserializeObject<GameDTO>(responseContent).Board;
            }

            //retrieve same game
            var sameSeed = new NewGameDTO { GameId = board.GameID, IsDaily = true, UserLocalTime = DateTime.Now.ToShortDateString() };
            StringContent secondPostContent = TestUtilities.ObjToStringContent(sameSeed);
            HttpResponseMessage secondResponse = await client.PostAsync("newgame", secondPostContent);
            string secondContent = await secondResponse.Content.ReadAsStringAsync();
            var sameBoard = JsonConvert.DeserializeObject<BoardDTO>(secondContent);

            Assert.AreEqual(66, sameBoard.CardsRemaining);
        }
    }
}
