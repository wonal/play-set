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

        public IEnumerable<Player> GetWeeklyScores(long currentTime)
        {
            long previousMonday = Utilities.GetPreviousMonday(currentTime);
            using (var connection = new SqliteConnection(connectionString))
            {
                return connection.Query<Player>("select * from Players where Date >= (@monday) order by Time limit 5", new { monday = previousMonday });
            }
        }

        public void UpdateScores(string name, int time, int seedValue, long completionDate)
        {
            lock (dbLockObject)
            {
                using (var connection = new SqliteConnection(connectionString))
                {
                    connection.Execute(@"insert into Players (Name, Time, Seed, Date) values (@Name, @Time, @Seed, @Date)",
                        new Player { Name = name, Time = time, Seed = seedValue, Date = completionDate });
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

        public void AddDateColumn()
        {
            using (var connection = new SqliteConnection(connectionString))
            {
                var rows = connection.Query(@"pragma table_info(Players)");
                var result = rows.Where(x => x.name == "Date").ToList();
                if (result.Count == 0)
                {
                    connection.Execute(@"alter table Players add column Date integer default 0");
                }
            }
        }
    }
}
