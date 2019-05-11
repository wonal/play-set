using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Set.Api.Models
{
    public class GameResult
    {
        public bool Success { get; set; }
        public Game GameObj { get; set; }
        public string Error { get; set; }
    }
}
