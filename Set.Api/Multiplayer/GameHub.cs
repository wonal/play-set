using Microsoft.AspNetCore.SignalR;
using Set.Api.Multiplayer.DTOs;
using System;
using System.Threading.Tasks;

namespace Set.Api.Multiplayer
{
    public class GameHub : Hub
    {
        private readonly MultiplayerGameHandler _multiplayerGameHandler;

        public GameHub(MultiplayerGameHandler multiplayerGameHandler)
        {
            _multiplayerGameHandler = multiplayerGameHandler;
        }

        public string CreateGame(CreateGameRequest createGameRequest)
        {
            var game = _multiplayerGameHandler.CreateGame(createGameRequest.PlayerName, Context.ConnectionId);
            return game.MultiplayerGameId;
        }

        public Task JoinGame(JoinGameRequest joinGameRequest)
            => _multiplayerGameHandler.JoinGame(joinGameRequest.PlayerName, joinGameRequest.GameId, Context.ConnectionId);

        public Task StartGame(StartGameRequest startGameRequest)
            => _multiplayerGameHandler.StartGame(startGameRequest.GameId, Context.ConnectionId);

        public Task MakeGuess(GuessDTO guess)
            => _multiplayerGameHandler.MakeGuess(Context.ConnectionId, guess);

    }
}
