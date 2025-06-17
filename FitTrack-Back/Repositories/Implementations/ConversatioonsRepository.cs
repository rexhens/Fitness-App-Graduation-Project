using FitnessApp.Data;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories.Implementations
{
    public class ConversatioonsRepository : IConversationRepository
    {
        private readonly FitnessAppDbContext _context;

        public ConversatioonsRepository(FitnessAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Conversation>> GetAllAsync()
        {
            return await _context.conversations.Include(c => c.messages).ToListAsync();
        }

        public async Task<Conversation?> GetByIdAsync(int id)
        {
            return await _context.conversations.Include(c => c.messages)
                                               .FirstOrDefaultAsync(c => c.id == id);
        }

        public async Task AddAsync(Conversation conversation)
        {
            await _context.conversations.AddAsync(conversation);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Conversation conversation)
        {
            _context.conversations.Update(conversation);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var conversation = await _context.conversations.FindAsync(id);
            if (conversation != null)
            {
                _context.conversations.Remove(conversation);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Conversation> GetByClientIdAsync(int user_id)
        {
            return await _context.conversations
                .Include(c => c.messages) 
                .FirstOrDefaultAsync(c => c.user_id == user_id); 
        }
    }
}
