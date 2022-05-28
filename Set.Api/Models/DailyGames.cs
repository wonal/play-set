using System;

namespace Set.Api.Models
{
    public static class DailyGames
    {
        public static int GetSeed(DateTime dateTime)
        {
            var currentDay = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day);
            return (int)(currentDay.Ticks % int.MaxValue); 
        }
    }
}
