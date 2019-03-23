using System;

namespace Set
{

    enum Characteristic
    {
        Option1,
        Option2,
        Option3
    }

    class Card
    {
        public Characteristic Color { get; }
        public Characteristic Shape { get; }
        public Characteristic Fill { get; }
        public Characteristic Count { get; }
    }

    class Program
    {
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

        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
