using Microsoft.AspNetCore.SignalR;
using Set.Api.Multiplayer.DTOs;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Set.Api.Multiplayer;

public class MultiplayerGameHandler
{
    public MultiplayerGameHandler(IHubContext<GameHub> hub)
    {
        _hub = hub;
        _ = PruneCompletedGames();
    }

    public Dictionary<string, (MultiplayerGame, SemaphoreSlim)> Games = new Dictionary<string, (MultiplayerGame, SemaphoreSlim)>();

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

            Games.Add(gameId, (game, new SemaphoreSlim(1)));
        }

        return game;
    }

    public async Task<bool> JoinGame(string playerName, string gameId, string connectionId)
    {
        using var gameHandle = await GetGame(gameId);
        return await gameHandle.Game.JoinGame(connectionId, playerName);
    }

    public async Task StartGame(string gameId, string connectionId)
    {
        using var gameHandle = await GetGame(gameId);
        await gameHandle.Game.StartGame(connectionId);
    }

    public async Task MakeGuess(string connectionId, GuessDTO guess)
    {
        using var gameHandle = await GetGame(connectionId);
        await gameHandle.Game.MakeGuess(connectionId, guess.Card1, guess.Card2, guess.Card3);
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
                    Games[game].Item2.Dispose();
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

    private async Task<GameHandle> GetGame(string connectionId)
    {
        var (game, sem) = Games[connectionId];
        await sem.WaitAsync();
        return new GameHandle(game, sem);
    }
}

struct GameHandle : IDisposable
{
    private readonly SemaphoreSlim _sem;

    public GameHandle(MultiplayerGame game, SemaphoreSlim sem)
    {
        Game = game;
        _sem = sem;
    }

    public MultiplayerGame Game { get; private set; }

    public void Dispose()
    {
        _sem.Release();
    }
}
