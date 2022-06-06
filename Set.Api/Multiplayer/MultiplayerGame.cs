using Set.Api.DTOs.Multiplayer;
using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Set.Api.Multiplayer
{
    public class MultiplayerGame
    {
        public MultiplayerGame(
            string multiplayerGameId,
            Game game,
            Func<IReadOnlyList<string>, IMultiplayerMessageDispatcher> dispatcherFactory,
            string playerId,
            string playerName)
        {
            MultiplayerGameId = multiplayerGameId;
            Game = game;
            _dispatcherFactory = dispatcherFactory;
            _players.Add(new MultiplayerPlayer(playerId, playerName, 0));
        }

        public async Task<bool> MakeGuess(string playerId, Card card1, Card card2, Card card3)
        {
            if(ActionCooldownTime > DateTime.UtcNow)
            {
                return false;
            }

            var player = Players.FirstOrDefault(x => x.Id == playerId);
            if (player is null) return false;

            var success = Game.MakeGuess(card1, card2, card3);
            if (success)
            {
                player.SetCount++;
                ActionCooldownTime = DateTime.UtcNow.AddSeconds(1);
                await Dispatcher.SetGuessed(new SetGuessedDTO
                {
                    Board = Game.Board,
                    PlayerName = player.Name,
                    Set = new List<Card> { card1, card2, card3 },
                    WinState = Game.WinState,
                });
            }
            else
            {
                await DispatcherToPlayer(playerId).BadGuess();
            }
            return success;
        }

        public Game Game { get; }

        public async Task<string> JoinGame(string playerId, string name)
        {
            var player = new MultiplayerPlayer(playerId, name, 0);
            _players.Add(player);
            await Dispatcher.PlayerJoined(name);
            return player.Id;
        }

        public async Task StartGame(string playerId)
        {
            if (playerId != _players[0].Id) return;
            Started = true;
            ActionCooldownTime = DateTime.UtcNow.AddSeconds(3);
            await Dispatcher.GameStarted(new GameStartedDTO { Board = Game.Board });
        }

        public IEnumerable<MultiplayerPlayer> Players => _players;

        private List<MultiplayerPlayer> _players = new List<MultiplayerPlayer>();
        private IMultiplayerMessageDispatcher Dispatcher => _dispatcherFactory(_players.Select(x => x.Id).ToList());
        private IMultiplayerMessageDispatcher DispatcherToPlayer(string playerId) => _dispatcherFactory(new[] { playerId } );
        private readonly Func<IReadOnlyList<string>, IMultiplayerMessageDispatcher> _dispatcherFactory;

        public bool Started { get; private set; }
        public DateTime ActionCooldownTime { get; private set; } = DateTime.UtcNow;
        public string MultiplayerGameId { get; }
    }
}
