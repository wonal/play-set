using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using SetApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace Set.Api
{
    public class Repository
    {
        private readonly object dbLockObject = new object();
        private readonly string connectionString;

        public Repository(IConfiguration config)
        {
            connectionString = $"Data Source={config["DBPath"]}playercontext.db";
        }

        public IEnumerable<Player> GetTopScores()
        {
            using (var connection = new SqliteConnection(connectionString))
            {
                return connection.Query<Player>("select * from Players order by Time limit 5");
            }
        }

        public IEnumerable<Player> GetScoresBySeed(int seed)
        {
            using (var connection = new SqliteConnection(connectionString))
            {
                return connection.Query<Player>("select * from Players where Seed = (@seed) order by Time limit 5", new { seed });
            }
        }

        public void UpdateScores(string name, int time, long completionDate, int seedValue)
        {
            lock (dbLockObject)
            {
                using (var connection = new SqliteConnection(connectionString))
                {
                    connection.Execute(@"insert into Players (Name, Time, Date, Seed) values (@Name, @Time, @Date, @Seed)",
                        new Player { Name = name, Time = time, Date = completionDate, Seed = seedValue });
                }
            }
        }

        public bool CheckDBHealth()
        {
            try
            {
                using (var connection = new SqliteConnection(connectionString))
                {
                    connection.Query<Player>("select * from Players limit 1");
                    return true;
                }
            }
            catch
            { return false; }
        }

        public void CreateTableIfNotExists()
        {
            using (var connection = new SqliteConnection(connectionString))
            {
                connection.Execute(@"create table if not exists Players (Id integer primary key, Name varchar(20), Time integer default null, Date integer default 0, Seed integer default null)");
            }
        }
    }
}
