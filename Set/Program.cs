using System;
using System.Collections.Generic;

namespace Set
{

    public enum Characteristic
    {
        Option1,
        Option2,
        Option3
    }

    public class Card
    {
        public Card(Characteristic color, Characteristic shape, Characteristic fill, Characteristic count)
        {
            Color = color;
            Shape = shape;
            Fill = fill;
            Count = count;
        }

        public Characteristic Color { get; }
        public Characteristic Shape { get; }
        public Characteristic Fill { get; }
        public Characteristic Count { get; }

        public static bool IsSet(Card card1, Card card2, Card card3)
        {
            return IsCharacteristicSet(card1.Color, card2.Color, card3.Color) &&
            IsCharacteristicSet(card1.Shape, card2.Shape, card3.Shape) &&
            IsCharacteristicSet(card1.Fill, card2.Fill, card3.Fill) &&
            IsCharacteristicSet(card1.Count, card2.Count, card3.Count);
        }

        static bool IsCharacteristicSet(Characteristic c1, Characteristic c2, Characteristic c3) => AllDifferent(c1, c2, c3) || AllSame(c1, c2, c3);
        static bool AllSame(Characteristic c1, Characteristic c2, Characteristic c3) => c1 == c2 && c2 == c3;
        static bool AllDifferent(Characteristic c1, Characteristic c2, Characteristic c3) => c1 != c2 && c2 != c3 && c1 != c3;
    }

        

    public class Deck
    {
        public List<Card> cards { get; }
        
        public Deck()
        {
            cards = InitializeDeck();
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
            Console.WriteLine(deck.Count);
            return deck;
        }
    }


    class Program
    {

        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            Deck game = new Deck();
            Console.ReadKey();
        }
    }
}
