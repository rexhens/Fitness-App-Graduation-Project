using FitnessApp.Models.Entities;

namespace FitnessApp.Repositories.Interfaces
{
    public interface IMessagesRepository
    {
        Task<IEnumerable<Message>> GetAllAsync();
        Task<Message?> GetByIdAsync(int id);
        Task<IEnumerable<Message>> GetByConversationIdAsync(int conversationId);
        Task AddAsync(Message message);
        Task DeleteAsync(int id);
        Task SaveMessage(string content, string role, int conversation_id);
    }
}
