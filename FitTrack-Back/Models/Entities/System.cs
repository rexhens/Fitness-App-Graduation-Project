namespace FitnessApp.Models.Entities
{
    public class System
    {
        public int id { get; set; }
        public string settingName { get; set; }
        public string settingValue { get; set; }
        public DateTime dateUpdated { get; set; } = DateTime.Now;
    }
}
