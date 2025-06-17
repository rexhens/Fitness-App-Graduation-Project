using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Models.Entities
{
    public class Message
    {
     
            public int id { get; set; }
            public required string role { get; set; } // e.g., "user", "assistant"
            public required string message { get; set; }
            public DateTime created_at { get; set; } = DateTime.UtcNow;
        [Column("conversation_id")]
            public int conversation_id {  get; set; }


        public bool is_user_message()
        {
            return role.Equals("user");
        }
    }
}
