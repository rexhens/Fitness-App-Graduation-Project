using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Models.Entities
{
    public class Progress
    {
        public int id { get; set; }
        public int user_id { get; set; }
        [Column("weight_kg")]
        public double weight { get; set; }
        [Column("height_cm")]
        public double height { get; set; }
        [Column("body_fat_percent")]
        public double body_fat_percentage { get; set; }
        public double muscle_mass {  get; set; }
        public double bmi {  get; set; }
        public string? notes {  get; set; }
        public DateTime measured_at { get; set; } = DateTime.UtcNow;

        public User? user { get; set; }
    }
}
