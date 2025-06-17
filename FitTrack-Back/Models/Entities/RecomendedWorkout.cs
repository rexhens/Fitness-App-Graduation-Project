namespace FitnessApp.Models.Entities
{
    public class RecomendedWorkout
    {
        public int id { get; set; }

        public required string workout_name { get; set; }

        public int status { get; set; } = 1;

        public int user_id { get; set; }
        public User? user { get; set; }

    }
}
