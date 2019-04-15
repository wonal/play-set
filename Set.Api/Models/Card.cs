using System;
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

        public override bool Equals(object obj)
        {
            var card = obj as Card;
            return card != null &&
                   Count == card.Count &&
                   Fill == card.Fill &&
                   Color == card.Color &&
                   Shape == card.Shape;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Count, Fill, Color, Shape);
        }
    }


}
