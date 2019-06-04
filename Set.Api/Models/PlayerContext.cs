using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace SetApi.Models
{
    public class PlayerContext : DbContext
    {
        private readonly IConfiguration config;

        public DbSet<Player> Players { get; set; }
        public PlayerContext(IConfiguration config)
        {
            this.config = config;
        }

        protected override void OnConfiguring (DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite($"Filename={config["DBPath"]}playercontext.db");
        }
    }

    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Time { get; set; }
        public int Seed { get; set; }
    }
}
