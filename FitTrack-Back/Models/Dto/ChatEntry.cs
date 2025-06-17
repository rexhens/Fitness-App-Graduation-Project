namespace FitnessApp.Models.Dto
{
    public class ChatEntry
    {
        public DateTime Timestamp { get; set; }
        public required string User { get; set; }
        public required string Assistant { get; set; }
    }
}
