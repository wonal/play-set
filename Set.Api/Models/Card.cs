using System.Collections.Generic;

namespace SetApi.Models
{
    public class Card
    {
        public Card(Characteristic color, Characteristic shape, Characteristic fill, Characteristic count)
        {
            Color = color;
            Shape = shape;
            Fill = fill;
            Count = count;
        }

        public Characteristic Color { get; }
        public Characteristic Shape { get; }
        public Characteristic Fill { get; }
        public Characteristic Count { get; }

    }


}
