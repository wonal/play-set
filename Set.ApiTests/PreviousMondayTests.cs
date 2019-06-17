using NUnit.Framework;
using Set.Api;
using System;

namespace SetTests
{
    class PreviousMondayTests
    {
        [Test]
        public void TestMondayReturnsMonday()
        {
            var monday = new DateTimeOffset(new DateTime(2019, 6, 17, 10, 30, 0)).ToUnixTimeMilliseconds();
            var normalizedMonday = new DateTimeOffset(new DateTime(2019, 6, 17, 0, 0, 0)).ToUnixTimeMilliseconds();
            Assert.AreEqual(normalizedMonday, Utilities.GetPreviousMonday(monday));
        }

        [Test]
        public void TestSundayReturnsPreviousMonday()
        {
            var monday = new DateTimeOffset(new DateTime(2019, 6, 16, 10, 30, 0)).ToUnixTimeMilliseconds();
            var normalizedMonday = new DateTimeOffset(new DateTime(2019, 6, 10, 0, 0, 0)).ToUnixTimeMilliseconds();
            Assert.AreEqual(normalizedMonday, Utilities.GetPreviousMonday(monday));
        }
    }
}
