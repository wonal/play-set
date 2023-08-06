using SetApi.Models;
using System;

namespace Set.Api.Models
{
    public static class DailyGames
    {
        public static int GetSeed(DateTime dateTime)
        {
            var currentDay = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day);
            var seed = (int)(currentDay.Ticks % int.MaxValue);
            var game = new Game(seed, DateTime.Today);
            return game.SeedValue;
        }
    }
}
