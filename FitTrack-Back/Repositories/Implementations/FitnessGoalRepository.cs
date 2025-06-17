using FitnessApp.Data;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories.Implementations
{
    public class FitnessGoalRepository : IFitnessGoalRepository
    {
        private readonly FitnessAppDbContext _context;

        public FitnessGoalRepository(FitnessAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FitnessGoal>> GetAllByUserIdAsync(int userId)
        {
            return await _context.fitness_goals
                                 .Where(g => g.user_id == userId)
                                 .ToListAsync();
        }

        public async Task<FitnessGoal?> GetByIdAsync(int id)
        {
            return await _context.fitness_goals.FindAsync(id);
        }

        public async Task AddAsync(FitnessGoal goal)
        {
            await _context.fitness_goals.AddAsync(goal);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(FitnessGoal goal)
        {
            _context.fitness_goals.Update(goal);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var goal = await _context.fitness_goals.FindAsync(id);
            if (goal != null)
            {
                _context.fitness_goals.Remove(goal);
                await _context.SaveChangesAsync();
            }
        }
    }
}

