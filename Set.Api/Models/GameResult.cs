using SetApi.Models;

namespace Set.Api.Models
{
    public class GameResult
    {
        public bool Success { get; set; }
        public Game GameObj { get; set; }
        public string Error { get; set; }
    }
}
