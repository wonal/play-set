using System;

namespace Set.Api.Multiplayer
{
    public class MultiplayerPlayer
    {
        public MultiplayerPlayer(string id, string name, int setCount)
        {
            Id = id;
            Name = name;
            SetCount = setCount;
        }

        public string Id { get; }
        public string Name { get; }
        public int SetCount { get; set; }
    }
}
