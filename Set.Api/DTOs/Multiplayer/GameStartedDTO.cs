using SetApi.Models;
using System.Collections.Generic;

namespace Set.Api.DTOs.Multiplayer
{
    public class GameStartedDTO
    {
        public List<Card> Board { get; set; }
    }
}
