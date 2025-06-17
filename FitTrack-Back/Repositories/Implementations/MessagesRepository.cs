using FitnessApp.Data;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories.Implementations
{
    public class MessagesRepository : IMessagesRepository
    {
        private readonly FitnessAppDbContext _context;

        public MessagesRepository(FitnessAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Message>> GetAllAsync()
        {
            return await _context.messages.ToListAsync();
        }

        public async Task<Message?> GetByIdAsync(int id)
        {
            return await _context.messages.FindAsync(id);
        }

        public async Task<IEnumerable<Message>> GetByConversationIdAsync(int conversationId)
        {
            return await _context.messages
                .Where(m => m.conversation_id == conversationId)
                .ToListAsync();
        }

        public async Task AddAsync(Message message)
        {
            await _context.messages.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var message = await _context.messages.FindAsync(id);
            if (message != null)
            {
                _context.messages.Remove(message);
                await _context.SaveChangesAsync();
            }
        }

        public async Task SaveMessage(string content, string role, int conversation_id)
        {
            var message = new Message
            {
                message = content,
                role = role,
                conversation_id = conversation_id,
            };
          
            await _context.messages.AddAsync(message);
            await _context.SaveChangesAsync();
        }
    }
}
