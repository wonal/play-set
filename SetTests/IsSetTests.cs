using NUnit.Framework;
using SetApi.Models;

namespace Tests
{
    public class IsSetTests
    {

        [Test]
        public void TestAllMatching()
        {
            var card1 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option1, Characteristic.Option1);
            var card2 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option1, Characteristic.Option1);
            var card3 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option1, Characteristic.Option1);
            Assert.AreEqual(true, Game.IsSet(card1, card2, card3));
        }

        [Test]
        public void TestNoneMatching()
        {
            var card1 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option1, Characteristic.Option1);
            var card2 = new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option2, Characteristic.Option2);
            var card3 = new Card(Characteristic.Option3, Characteristic.Option3, Characteristic.Option3, Characteristic.Option3);
            Assert.AreEqual(true, Game.IsSet(card1, card2, card3));
        }

        [Test]
        public void TestMismatchedSet()
        {
            var card1 = new Card(Characteristic.Option1, Characteristic.Option2, Characteristic.Option3, Characteristic.Option3);
            var card2 = new Card(Characteristic.Option1, Characteristic.Option3, Characteristic.Option3, Characteristic.Option2);
            var card3 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option3, Characteristic.Option1);
            Assert.AreEqual(true, Game.IsSet(card1, card2, card3));
        }

        [Test]
        public void TestInvalidSet()
        {
            var card1 = new Card(Characteristic.Option2, Characteristic.Option2, Characteristic.Option3, Characteristic.Option3);
            var card2 = new Card(Characteristic.Option1, Characteristic.Option3, Characteristic.Option3, Characteristic.Option2);
            var card3 = new Card(Characteristic.Option1, Characteristic.Option1, Characteristic.Option3, Characteristic.Option1);
            Assert.False(Game.IsSet(card1, card2, card3));
        }
    }
}