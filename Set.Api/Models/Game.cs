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
            while (!BoardContainsSet(Board))
            {
                deck.Cards.AddRange(Board);
                Deck.Shuffle(deck.Cards);
                Board = deck.DrawCard(12);
            }
        }

        public static bool BoardContainsSet(List<Card> board)
        {
            int length = board.Count;
            for (int i = 0; i < length-2; i++)
            {
                for(int j = i+1; j < length-1; j++)
                {
                    for (int k = j+1; k < length; k++)
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

        public List<Card> AddCardsIfNoSet(List<Card> board) => !BoardContainsSet(board) ? deck.DrawCard(3) : new List<Card>();
        public static bool IsSet(Card card1, Card card2, Card card3) => IsCharacteristicSet(card1.Color, card2.Color, card3.Color) &&
                                                                        IsCharacteristicSet(card1.Shape, card2.Shape, card3.Shape) &&
                                                                        IsCharacteristicSet(card1.Fill, card2.Fill, card3.Fill) &&
                                                                        IsCharacteristicSet(card1.Count, card2.Count, card3.Count);
        private static bool IsCharacteristicSet(Characteristic c1, Characteristic c2, Characteristic c3) => AllDifferent(c1, c2, c3) || AllSame(c1, c2, c3);
        private static bool AllSame(Characteristic c1, Characteristic c2, Characteristic c3) => c1 == c2 && c2 == c3;
        private static bool AllDifferent(Characteristic c1, Characteristic c2, Characteristic c3) => c1 != c2 && c2 != c3 && c1 != c3;

        public (bool,List<Card>) MakeGuess(Card card1, Card card2, Card card3)
        {
            if (Game.IsSet(card1, card2, card3)){
                List<Card> cards = new List<Card> { card1, card2, card3 };
                if (Board.Count > 12)
                {
                    UpdateExtendedBoard(cards);
                }
                else
                {
                    UpdateNormalBoard(cards);
                }
                return (true, Board);
            }
            return (false, Board);
        }

        private void UpdateNormalBoard(List<Card> cards)
        {
            for (int i = 0; i < 3; i++)
            {
                int index = Board.IndexOf(cards[i]);
                Board.RemoveAt(index);
                Board.Insert(index, deck.DrawCard(1)[0]);
            }
            Board.AddRange(AddCardsIfNoSet(Board));
  
        }

        private void UpdateExtendedBoard(List<Card> cards)
        {
            List<int> indices = new List<int>();
            for (int i = 0; i < 3; i++)
            {
                indices.Add(Board.IndexOf(cards[i]));
            }
            cards.ForEach(card => Board.Remove(card));
            List<Card> cardsToAdd = AddCardsIfNoSet(Board);
            if (cardsToAdd.Count != 0)
            {
                indices.Sort();
                for(int i = 0; i < 3; i++)
                {
                    Board.Insert(indices[i], cardsToAdd[i]);
                }
            }
        }

    }
}
