using System;
using System.Collections.Generic;
using System.Text;
using NUnit.Framework;
using SetApi.Models;

namespace SetTests
{
    class BoardContainsSetTests
    {
        [Test]
        public void TestBoardWithNoValidSet()
        {
            List<Card> board = new List<Card> { new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option2, Characteristic.Option2),
                                                new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option2, Characteristic.Option3),
                                                new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option2, Characteristic.Option2),
                                                new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option3, Characteristic.Option2),
                                                new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option3, Characteristic.Option3),
                                                new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option3, Characteristic.Option2),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option3, Characteristic.Option3),
                                                new Card(Characteristic.Option2, Characteristic.Option3, Characteristic.Option3, Characteristic.Option3),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option2, Characteristic.Option3),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option3, Characteristic.Option1),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option2, Characteristic.Option1),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option2, Characteristic.Option3)};
            Assert.IsFalse(Game.BoardContainsSet(board));
        }

        [Test]
        public void TestBoardContainingSet()
        {
            List<Card> board = new List<Card> {
                                                new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option2, Characteristic.Option2),
                                                new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option2, Characteristic.Option3),
                                                new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option2, Characteristic.Option2),
                                                new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option3, Characteristic.Option2),
                                                new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option3, Characteristic.Option3),
                                                new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option3, Characteristic.Option2),
                                                new Card(Characteristic.Option2, Characteristic.Option3, Characteristic.Option3, Characteristic.Option2),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option3, Characteristic.Option1),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option2, Characteristic.Option3),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option3, Characteristic.Option2),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option2, Characteristic.Option1),
                                                new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option1, Characteristic.Option3)};
            Assert.IsTrue(Game.BoardContainsSet(board));
        }
    }
}
