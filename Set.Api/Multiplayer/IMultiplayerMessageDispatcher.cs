using Set.Api.DTOs.Multiplayer;
using System.Threading.Tasks;

namespace Set.Api.Multiplayer
{
    public interface IMultiplayerMessageDispatcher
    {
        Task SetGuessed(SetGuessedDTO guess);
        Task PlayerJoined(string playerName);
        Task GameStarted(GameStartedDTO gameStarted);
        Task BadGuess();
    }
}
