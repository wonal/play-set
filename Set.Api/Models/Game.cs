using System.Collections.Generic;

namespace SetApi.Models
{
    public class Game
    {
        private List<Card> board;
        private Deck deck;

        public Game()
        {
            deck = new Deck();
            board = deck.DrawCard(12);
        }

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

        public bool MakeGuess(Card card1, Card card2, Card card3)
        {
            if (IsSet(card1, card2, card3))
            {
                board.Remove(card1);
                board.Remove(card2);
                board.Remove(card3);
                board.AddRange(deck.DrawCard(3));
                return true;
            }
            return false;
        }

        public List<Card> DrawCards(int numCards)
        {
            return deck.DrawCard(numCards);
        }
    }
}
