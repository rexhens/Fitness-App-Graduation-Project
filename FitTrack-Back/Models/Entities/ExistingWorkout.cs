using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Models.Entities
{
    public class ExistingWorkout
    {
            public int id { get; set; }
            public required string name { get; set; }
            public required string duration { get; set; }
            public int calories { get; set; }
            public required string difficulty { get; set; }
            public string? equipment { get; set; }
             [Column("target_muscles")]
            public string? targetMuscles { get; set; }
            public string? steps { get; set; }
        
    }
}
