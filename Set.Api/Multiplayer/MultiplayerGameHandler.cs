using Microsoft.AspNetCore.SignalR;
using Set.Api.Multiplayer.DTOs;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Set.Api.Multiplayer
{
    public class MultiplayerGameHandler
    {
        public MultiplayerGameHandler(IHubContext<GameHub> hub)
        {
            _hub = hub;
            _ = PruneCompletedGames();
        }

        public Dictionary<string, (MultiplayerGame, ChannelWriter<Func<Task>>)> Games = new Dictionary<string, (MultiplayerGame, ChannelWriter<Func<Task>>)>();

        public MultiplayerGame CreateGame(string playerName, string connectionId)
        {
            MultiplayerGame game = null;

            lock(Games)
            {
                string gameId = null;
                do
                {
                    gameId = GenerateGameId();
                }
                while(Games.ContainsKey(gameId));

                game = new MultiplayerGame(
                    gameId,
                    new SetApi.Models.Game(null, DateTime.UtcNow),
                    connectionIds => new MultiplayerMessageDispatcher(_hub.Clients.Clients(connectionIds)),
                    connectionId,
                    playerName);

                var channel = Channel.CreateBounded<Func<Task>>(10);
                _ = Task.Run(async () => {
                    await foreach(var f in channel.Reader.ReadAllAsync())
                    {
                        await f();
                    }
                });
                Games.Add(gameId, (game, channel.Writer));
            }

            return game;
        }

        public async Task JoinGame(string playerName, string gameId, string connectionId)
        {
            var (game, channelWriter) = Games[gameId];
            await channelWriter.WriteAsync(() => game.JoinGame(connectionId, playerName));
        }

        public async Task StartGame(string gameId, string connectionId)
        {
            var (game, channelWriter) = Games[gameId];
            await channelWriter.WriteAsync(() => game.StartGame(connectionId));
        }

        public async Task MakeGuess(string connectionId, GuessDTO guess)
        {
            var (game, channelWriter) = Games[guess.GameID];
            await channelWriter.WriteAsync(() => game.MakeGuess(connectionId, guess.Card1, guess.Card2, guess.Card3));
        }

        private async Task PruneCompletedGames()
        {
            while (true)
            {
                var gamesToRemove = new List<string>();
                foreach(var game in Games)
                {
                    if(game.Value.Item1.Game.WinState || game.Value.Item1.Game.GameTime.StartTime - DateTime.UtcNow > TimeSpan.FromHours(12))
                    {
                        gamesToRemove.Add(game.Key);
                    }
                }

                lock(Games)
                {
                    foreach (var game in gamesToRemove)
                    {
                        Games[game].Item2.TryComplete();
                        Games.Remove(game);
                    }
                }

                await Task.Delay(TimeSpan.FromMinutes(5));
            }
        }

        static char[] GameNameChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();
        private readonly IHubContext<GameHub> _hub;

        public string GenerateGameId()
        {
            var gameId = new StringBuilder();
            for(var i = 0; i < 6; i++)
            {
                gameId.Append(GameNameChars[Random.Shared.Next(GameNameChars.Length)]);
            }
            return gameId.ToString();
        }
    }
}
