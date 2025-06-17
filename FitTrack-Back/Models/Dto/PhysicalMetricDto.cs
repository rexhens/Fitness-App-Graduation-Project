namespace FitnessApp.Models.Dto
{
    public class PhysicalMetricDto
    {
        public int age { get; set; }
        public required string gender { get; set; }
        public float weight_kg { get; set; }
        public float height_cm { get; set; }
        public float body_fat_percentage { get; set; } = -1;
        public float muscle_mass { get; set; } = -1;
        public float bmi { get; set; } = -1;
    }
}
