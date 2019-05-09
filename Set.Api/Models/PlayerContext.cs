using Microsoft.EntityFrameworkCore;

namespace SetApi.Models
{
    public class PlayerContext : DbContext
    {
        public DbSet<Player> Players { get; set; }

        protected override void OnConfiguring (DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=./playercontext.db");
        }
    }

    public class Player
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Time { get; set; }
    }
}
