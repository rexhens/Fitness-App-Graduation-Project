using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Models.Entities
{
    public class User
    {
        public int id { get; set; }
        public required string name { get; set; }
        public required string surname { get; set; }
        public required string email { get; set; }
        [Column("password_hash")]
        public required string password { get; set; }
        public DateTime created_at { get; set; } = DateTime.UtcNow;

    }
}
