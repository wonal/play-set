using System;
using System.Collections.Generic;

namespace Set
{
    public class Deck
    {
        public List<Card> Cards { get; }
        
        public Deck()
        {
            Cards = InitializeDeck();
        }

        private static List<Card> InitializeDeck()
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
            Shuffle(deck);
            return deck;
        }

        private static void Shuffle(List<Card> cards)
        {
            Random r = new Random();
            for (int i = cards.Count-1; i > -1; i -= 1)
            {
                int j = r.Next(0, i+1);
                Card temp = cards[i];
                cards[i] = cards[j];
                cards[j] = temp;
            }
        }

        public Card DrawCard()
        {
            Card card = Cards[0];
            Cards.Remove(card);
            return card;
        }
    }
}
