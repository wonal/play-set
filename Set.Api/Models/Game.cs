﻿using System.Collections.Generic;

namespace SetApi.Models
{
    public class Game
    {
        private readonly Deck deck;
        public List<Card> Board { get; private set;}
        public bool ValidSet { get; set; }
        public bool WinState { get; set; }
        public int CardsRemaining => Board.Count + deck.Cards.Count; 
        public Stopwatch GameTime { get; private set; }
        public bool GameStarted { get; set; }
        public bool WinRecorded { get; set; }
        public int? SeedValue { get; private set; }

        public Game(int? seedValue)
        {
            SeedValue = seedValue;
            deck = new Deck(seedValue);
            CreateGame();
        }

        public void CreateGame()
        {
            ValidSet = false;
            WinState = false;
            Board = deck.DrawCard(12);
            while (!BoardContainsSet(Board))
            {
                deck.Cards.AddRange(Board);
                if (SeedValue.HasValue)
                {
                    deck.SeedValue += 1;
                }
                Deck.Shuffle(deck.Cards, deck.SeedValue);
                Board = deck.DrawCard(12);
            }
            GameTime = new Stopwatch();
            GameStarted = false;
            WinRecorded = false;
        }

        private bool EmptyDeck()
        {
            return deck.Cards.Count == 0;
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

        public static bool IsSet(Card card1, Card card2, Card card3) => IsCharacteristicSet(card1.Color, card2.Color, card3.Color) &&
                                                                        IsCharacteristicSet(card1.Shape, card2.Shape, card3.Shape) &&
                                                                        IsCharacteristicSet(card1.Fill, card2.Fill, card3.Fill) &&
                                                                        IsCharacteristicSet(card1.Count, card2.Count, card3.Count);
        private static bool IsCharacteristicSet(Characteristic c1, Characteristic c2, Characteristic c3) => AllDifferent(c1, c2, c3) || AllSame(c1, c2, c3);
        private static bool AllSame(Characteristic c1, Characteristic c2, Characteristic c3) => c1 == c2 && c2 == c3;
        private static bool AllDifferent(Characteristic c1, Characteristic c2, Characteristic c3) => c1 != c2 && c2 != c3 && c1 != c3;

        public bool ValidCards(Card card1, Card card2, Card card3)
        {
            return Board.Contains(card1) && Board.Contains(card2) && Board.Contains(card3);
        }

        public bool MakeGuess(Card card1, Card card2, Card card3)
        {
            if (!IsSet(card1, card2, card3))
            {
                return false;
            }

            List<Card> cards = new List<Card> { card1, card2, card3 };
            if (EmptyDeck())
            {
                RemoveFromBoard(cards);
                if (!BoardContainsSet(Board))
                {
                    WinState = true;
                    GameTime.MarkEnd();
                }
            }
            else
            {
                UpdateBoard(cards);
            }

            return true;
        }

        private void RemoveFromBoard(List<Card>cards)
        {
            foreach (Card card in cards)
            {
                Board.Remove(card);
            }
        }

        private void UpdateBoard(List<Card> cards)
        {
            List<int> indices = new List<int>();
            foreach (Card card in cards)
            {
                indices.Add(Board.IndexOf(card));
            }
            indices.Sort();
            foreach (Card card in cards)
            {
                Board.Remove(card);
            }

            bool boardContainsSet = BoardContainsSet(Board);
            if ((Board.Count >= 12 && !boardContainsSet) || Board.Count < 12)
            {
                foreach (int index in indices)
                {
                    Board.Insert(index, deck.DrawCard(1)[0]);
                }
            }

            boardContainsSet = BoardContainsSet(Board);
            while (!boardContainsSet)
            {
                Board.AddRange(deck.DrawCard(3));
                boardContainsSet = BoardContainsSet(Board);
                if (!boardContainsSet)
                {
                    WinState = true;
                    GameTime.MarkEnd();
                    break;
                }
            }
        }

    }
}
