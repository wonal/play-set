using System;
using System.Collections.Generic;

namespace SetApi.Models
{
    public class Game
    {
        private Deck deck;
        public List<Card> Board { get; }

        public Game()
        {
            deck = new Deck();
            Board = deck.DrawCard(12);
        }

        public static bool BoardContainsSet(List<Card> board)
        {
            for (int i = 0; i < 10; i++)
            {
                for(int j = i+1; j < 11; j++)
                {
                    for (int k = j+1; k < 12; k++)
                    {
                        if (Game.IsSet(board[i], board[j], board[k]))
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
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

        public (bool,List<Card>) MakeGuess(Card card1, Card card2, Card card3)
        {
            if (Game.IsSet(card1, card2, card3)){
                List<Card> cards = new List<Card> { card1, card2, card3 };
                for (int i = 0; i < 3; i++)
                {
                    int index = Board.IndexOf(cards[i]);
                    Board.RemoveAt(index);
                    Board.Insert(index, deck.DrawCard(1)[0]);
                }
                return (true, Board);
            }
            return (false, Board);
        }

        public List<Card> DrawCards(int numCards)
        {
            return deck.DrawCard(numCards);
        }
    }
}
