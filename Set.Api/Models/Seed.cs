
namespace SetApi.Models
{
    public class Seed
    {
        public bool HasSeed { get; private set; }
        public int SeedValue { get; private set; }

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
