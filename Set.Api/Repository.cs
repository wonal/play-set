using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using SetApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public IEnumerable<Player> GetScores()
        {
            using (var connection = new SqliteConnection(connectionString))
            {
                return connection.Query<Player>("select * from Players order by Time limit 5");
            }
        }

        public void UpdateScores(string name, int time, int seedValue)
        {
            lock (dbLockObject)
            {
                using (var connection = new SqliteConnection(connectionString))
                {
                    connection.Execute(@"insert into Players (Name, Time, Seed) values (@Name, @Time, @Seed)",
                        new Player { Name = name, Time = time, Seed = seedValue });
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
    }
}
