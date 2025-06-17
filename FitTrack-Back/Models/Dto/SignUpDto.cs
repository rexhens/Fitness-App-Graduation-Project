namespace FitnessApp.Models.Dto
{
    public class SignUpDto
    {
        public required string name { get; set; }
        public required string surname { get; set; }
        public required string email { get; set; }
        public required string password {  get; set; }
    }
}
