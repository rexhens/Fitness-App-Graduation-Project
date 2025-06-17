namespace FitnessApp.Models.Dto
{
    public class FitnessGoalDto
    {
        public required string goal_description { get; set; }
        public DateTime target_date { get; set; }
    }
}
