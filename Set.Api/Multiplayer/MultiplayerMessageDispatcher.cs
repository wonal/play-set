using Microsoft.AspNetCore.SignalR;
using Set.Api.DTOs.Multiplayer;
using Set.Api.Multiplayer.DTOs;
using System.Threading.Tasks;

namespace Set.Api.Multiplayer
{
    public class MultiplayerMessageDispatcher : IMultiplayerMessageDispatcher
    {
        private readonly IClientProxy _clientProxy;

        public MultiplayerMessageDispatcher(IClientProxy clientProxy)
        {
            _clientProxy = clientProxy;
        }

        public Task BadGuess()
            => _clientProxy.SendAsync("BadGuess");

        public Task GameStarted(GameStartedDTO gameStarted) =>
            _clientProxy.SendAsync("GameStarted", gameStarted);

        public Task PlayerJoined(string playerName) =>
            _clientProxy.SendAsync("PlayerJoined", new PlayerJoinedMessage { PlayerName = playerName });

        public Task SetGuessed(SetGuessedDTO guess)
            => _clientProxy.SendAsync("SetGuessed", guess);
    }
}
