using Newtonsoft.Json;
using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Set.ApiTests
{
    class TestUtilities
    {
        public static HttpClient GetHttpClient()
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:5000/api/set/");
            return client;
        }

        public static StringContent ObjToStringContent<T>(T t)
        {
            string jsonObj = JsonConvert.SerializeObject(t);
            return new StringContent(jsonObj, Encoding.UTF8, "application/json");
        }
        public static List<Card> FindSet(List<Card> board)
        {
            int length = board.Count;
            List<Card> set = new List<Card>();
            for (int i = 0; i < length-2; i++)
            {
                for(int j = i+1; j < length-1; j++)
                {
                    for (int k = j+1; k < length; k++)
                    {
                        if (Game.IsSet(board[i], board[j], board[k]))
                        {
                            set.Add(board[i]);
                            set.Add(board[j]);
                            set.Add(board[k]);
                            return set;
                        }
                    }
                }
            }
            return set;
        }
        public static bool BoardContainsCards(List<Card> board, Card card1, Card card2, Card card3)
        {
            if(board.Count == 0)
            {
                return false;
            }

            int matches = 0;
            foreach (Card card in board)
            {
                matches += (card.Equals(card1) || card.Equals(card2) || card.Equals(card3)) ?  1 :  0;
            }

            return matches == 3;
        }

    }
}
