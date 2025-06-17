using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Models.Entities
{
    public class Conversation
    {
        public int id { get; set; }
        [Column("user_id")]
        public int user_id { get; set; }
        public string title { get; set; }
        public DateTime started_at { get; set; } = DateTime.UtcNow;
        public User? user { get; set; }
        public ICollection<Message>? messages { get; set; }
    }
}
