using Newtonsoft.Json;
using NUnit.Framework;
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
        private readonly string url = "http://localhost:5000/api/set";
        private StringContent postContent;

        [SetUp]
        public void TestSetup()
        {
            Seed seed = new Seed { HasSeed = true, SeedValue = 42 };
            string seedObj = JsonConvert.SerializeObject(seed);
            postContent = new StringContent(seedObj, Encoding.UTF8, "application/json");
        }

        [Test]
        public async Task TestOkResult()
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.PostAsync(url + "/newgame", postContent);
                string content = await response.Content.ReadAsStringAsync();
                Guid id = JsonConvert.DeserializeObject<BoardDTO>(content).GameID;

                HttpResponseMessage startResponse = await client.GetAsync($"{url}/markstart/{id}");

                Assert.AreEqual(HttpStatusCode.OK, startResponse.StatusCode);
            }
        }

        [Test]
        public async Task TestBadRequestWithOngoingGame()
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.PostAsync(url + "/newgame", postContent);
                string content = await response.Content.ReadAsStringAsync();
                Guid id = JsonConvert.DeserializeObject<BoardDTO>(content).GameID;

                HttpResponseMessage startResponse1 = await client.GetAsync($"{url}/markstart/{id}");
                HttpResponseMessage startResponse2 = await client.GetAsync($"{url}/markstart/{id}");

                Assert.AreEqual(HttpStatusCode.BadRequest, startResponse2.StatusCode);
            }
        }
    }
}