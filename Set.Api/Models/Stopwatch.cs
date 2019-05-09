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

        public string GetTotalTime()
        {
            TimeSpan time = EndTime - StartTime;
            if (time.Seconds == 0 && time.Minutes == 0 && time.Hours == 0)
            {
                return "Time: --h:--m:--s";
            }
            string hours = time.Hours < 10 ? $"0{time.Hours}h:" : $"{time.Hours}h:";
            string minutes = time.Minutes < 10 ? $"0{time.Minutes}m:" : $"{time.Minutes}m:";
            string seconds = time.Seconds < 10 ? $"0{time.Seconds}s" : $"{time.Seconds}s";
            return $"Time: {hours + minutes + seconds}";
        }
    }
}
