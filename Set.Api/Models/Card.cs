using System.Collections.Generic;

namespace SetApi.Models
{
    public class Card
    {
        public Card(Characteristic count, Characteristic fill, Characteristic color, Characteristic shape)
        {
            Count = count;
            Fill = fill;
            Color = color;
            Shape = shape;
        }

        public Characteristic Count { get; }
        public Characteristic Fill { get; }
        public Characteristic Color { get; }
        public Characteristic Shape { get; }

    }


}
