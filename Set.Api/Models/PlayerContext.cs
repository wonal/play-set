using System;
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
        public int Id { get; set; }
        public string Name { get; set; }
        public int Time { get; set; }
    }
}
