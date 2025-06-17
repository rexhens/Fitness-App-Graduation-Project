using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Models.Dto
{
    public class ProgressDto
    {
        public int age {  get; set; }
        public double weight { get; set; }
        public double height { get; set; }
        public double body_fat_percentage { get; set; } = 0;
        public double muscle_mass { get; set; } = 0;
        public double bmi { get; set; } = 0;
        public string? notes { get; set; }
    }
}
