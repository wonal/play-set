using System;

namespace Set.Api
{
    public class Utilities
    {
        public static long GetPreviousMonday(long time)
        {
            var currentDate = new DateTime(time);
            int diff = ((currentDate.DayOfWeek - DayOfWeek.Monday) + 7) % 7;
            DateTime mondayDate = currentDate.AddDays(-1 * diff);
            var normalizedMonday = new DateTimeOffset(new DateTime(mondayDate.Year, mondayDate.Month, mondayDate.Day, 0, 0, 0));
            return normalizedMonday.ToUnixTimeMilliseconds();
        }
    }
}
