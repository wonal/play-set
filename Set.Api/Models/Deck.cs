using System;
using System.Collections.Generic;
using System.Linq;

namespace SetApi.Models
{
    public class Deck
    {
        public List<Card> Cards { get; }
        public int? SeedValue { get; set; }
        
        public Deck(int? seedValue)
        {
            SeedValue = seedValue;
            Cards = InitializeDeck();
        }

        private List<Card> InitializeDeck()
        {
            List<Characteristic> options = new List<Characteristic> { Characteristic.Option1, Characteristic.Option2, Characteristic.Option3 };
            List<Card> deck = new List<Card>();
            foreach (Characteristic c1 in options)
            {
                foreach (Characteristic c2 in options)
                {
                    foreach (Characteristic c3 in options)
                    {
                        foreach (Characteristic c4 in options)
                        {
                            deck.Add(new Card(c1, c2, c3, c4));
                        }
                    }
                }
            }
            Deck.Shuffle(deck, SeedValue);
            return deck;
        }

        public static void Shuffle(List<Card> cards, int? seedValue)
        {
            Random r = seedValue.HasValue ? new Random(seedValue.Value) : new Random();
            for (int i = cards.Count-1; i > -1; i -= 1)
            {
                int j = r.Next(0, i+1);
                Card temp = cards[i];
                cards[i] = cards[j];
                cards[j] = temp;
            }
        }

        public List<Card> DrawCard(int numCards)
        {
            if (Cards.Count == 0)
            {
                return new List<Card>();
            }
            var cards = Cards.Take(numCards).ToList();
            Cards.RemoveRange(0, numCards);
            return cards;
        }
    }
}
