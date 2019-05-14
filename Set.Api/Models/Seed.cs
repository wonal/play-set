
namespace SetApi.Models
{
    public class Seed
    {
        public bool HasSeed { get; set; }
        public int SeedValue { get; set; }

        public Seed()
        {
            HasSeed = false;
            SeedValue = 0;
        }

        public Seed(int seed)
        {
            SeedValue = seed;
            HasSeed = true;
        }
    }
}
