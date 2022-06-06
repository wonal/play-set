using Set.Api.Multiplayer;
using SetApi.Models;
using System.Collections.Generic;

namespace Set.Api.DTOs.Multiplayer
{
    public class SetGuessedDTO
    {
        public string PlayerName { get; set; }
        public List<Card> Set { get; set; }
        public List<Card> Board { get; set; }
        public bool WinState { get; set; }
        public List<MultiplayerPlayer> Players { get; set; }
    }
}
