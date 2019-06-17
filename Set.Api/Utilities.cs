using System;

namespace Set.Api
{
    public class Utilities
    {
        public static long GetPreviousMonday(long time)
        {
            DateTimeOffset currentDate = DateTimeOffset.FromUnixTimeMilliseconds(time);
            int diff = ((currentDate.DayOfWeek - DayOfWeek.Monday) + 7) % 7;
            DateTimeOffset mondayDate = currentDate.AddDays(-1 * diff);
            var normalizedMonday = new DateTimeOffset(new DateTime(mondayDate.Year, mondayDate.Month, mondayDate.Day, 0, 0, 0));
            return normalizedMonday.ToUnixTimeMilliseconds();
        }
    }
}
