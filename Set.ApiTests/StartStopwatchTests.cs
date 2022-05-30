using Newtonsoft.Json;
using NUnit.Framework;
using Set.Api.Models;
using SetApi.Models;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Set.ApiTests
{
    public class StartStopWatchTests
    {
        private StringContent postContent;

        [SetUp]
        public void TestSetup()
        {
            var seed = new NewGameDTO { IsDaily = true, UserLocalTime = new DateTime(2022, 5, 29).ToShortTimeString() };
            postContent = TestUtilities.ObjToStringContent(seed);
        }

        [Test]
        public async Task TestOkResult()
        {
            HttpClient client = TestUtilities.GetHttpClient();
            HttpResponseMessage response = await client.PostAsync("newgame", postContent);
            string content = await response.Content.ReadAsStringAsync();
            Guid id = JsonConvert.DeserializeObject<BoardDTO>(content).GameID;

            HttpResponseMessage startResponse = await client.GetAsync($"markstart/{id}");
            HttpResponseMessage startResponse2 = await client.GetAsync($"markstart/{id}");

            Assert.AreEqual(HttpStatusCode.OK, startResponse.StatusCode);
            Assert.AreEqual(HttpStatusCode.OK, startResponse2.StatusCode);
        }
    }
}