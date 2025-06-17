namespace FitnessApp.Models.Entities
{
    public class PhysicalMetrics
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public int age { get; set; }
        public required string gender { get; set; }

        public float weight_kg { get; set; }
        public float height_cm { get; set; }

        public float body_fat_percentage { get; set; } = -1;
        public float muscle_mass { get; set; } = -1;
        public float bmi { get; set; } = -1;

        public DateTime measured_at { get; set; } = DateTime.UtcNow;

        public User? user { get; set; }

        public override string ToString()
        {
            var parts = new List<string>
            {
                $"Age: {age}",
                $"Gender: {gender}",
                $"Weight: {weight_kg} kg",
                $"Height: {height_cm} cm"
            };

            if (body_fat_percentage >= 0)
                parts.Add($"Body Fat: {body_fat_percentage}%");

            if (muscle_mass >= 0)
                parts.Add($"Muscle Mass: {muscle_mass} kg");

            if (bmi >= 0)
                parts.Add($"BMI: {bmi}");

            return "Here are my physical metrics: " + string.Join(", ", parts) + ".";
        }
    }
}

