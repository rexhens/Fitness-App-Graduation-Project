using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Models.Entities
{
    public class FitnessGoal
    {
        public int id { get; set; }
        public int user_id { get; set; }
        [Column("goal")]
        public required string goal_description { get; set; }
        public DateTime target_date { get; set; }
        [Column("progress_of_goal")]
        public double? progress { get; set; } = 0;
        public DateTime created_at { get; set; } = DateTime.UtcNow;

        public User? user { get; set; }
        public override string ToString()
        {
            return $"My fitness goal is: {goal_description}. I want to achieve it by {target_date:MMMM dd, yyyy}.";
        }

    }
}
