using FitnessApp.Models.Entities;

namespace FitnessApp.Repositories.Interfaces
{
    public interface IConversationRepository
    {
        Task<IEnumerable<Conversation>> GetAllAsync();
        Task<Conversation?> GetByIdAsync(int id);
        Task AddAsync(Conversation conversation);
        Task UpdateAsync(Conversation conversation);
        Task DeleteAsync(int id);
        Task<Conversation> GetByClientIdAsync(int id);
    }
}
