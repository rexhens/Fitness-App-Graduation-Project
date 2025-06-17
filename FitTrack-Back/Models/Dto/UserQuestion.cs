namespace FitnessApp.Models.Dto
{
    public class UserQuestion
    {
        public required string question { get; set; }

        public UserQuestion(string question)
        {
            this.question = question;
        }
    }
}
