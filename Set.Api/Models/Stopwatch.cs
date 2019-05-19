using System;

namespace SetApi.Models
{
    public class Stopwatch
    {
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        
        public Stopwatch()
        {
            StartTime = DateTimeOffset.UtcNow;
            EndTime = StartTime;
        }
        public void MarkStart()
        {
            StartTime = DateTimeOffset.UtcNow;
        }
        public void MarkEnd()
        {
            EndTime = DateTimeOffset.UtcNow;
        }

        public int GetTotalTime()
        {
            return Convert.ToInt32((EndTime - StartTime).TotalMilliseconds);
        }
    }
}
