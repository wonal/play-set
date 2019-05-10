using System;

namespace SetApi.Models
{
    public class Stopwatch
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        
        public Stopwatch()
        {
            StartTime = DateTime.Now;
            EndTime = StartTime;
        }
        public void MarkStart()
        {
            StartTime = DateTime.Now;
        }
        public void MarkEnd()
        {
            EndTime = DateTime.Now;
        }

        public int GetTotalTime()
        {
            return Convert.ToInt32((EndTime - StartTime).TotalMilliseconds);
        }
    }
}
