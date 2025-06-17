using FitnessApp.Data;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories.Implementations
{
    public class ProgressRepository : IProgressRepository
    {

        private readonly FitnessAppDbContext _context;

        public ProgressRepository(FitnessAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Progress progress)
        {
            _context.progress.Add(progress);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Progress>> GetByUserIdAsync(int userId)
        {
            return await _context.progress
                .Where(p => p.user_id == userId)
                .OrderByDescending(p => p.measured_at)
                .ToListAsync();
        }
    }
}
