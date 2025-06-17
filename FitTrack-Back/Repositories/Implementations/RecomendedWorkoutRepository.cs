using FitnessApp.Data;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories.Implementations
{
    public class RecomendedWorkoutRepository : IRecomendedWorkoutRepository
    {
        private readonly FitnessAppDbContext _context;

        public RecomendedWorkoutRepository(FitnessAppDbContext context)
        {
            _context = context;
        }

        // Get all workouts
        public async Task<List<RecomendedWorkout>> GetAllAsync()
        {
            return await _context.recomended_workouts
                                 .Include(r => r.user)
                                 .ToListAsync();
        }

        // Get workout by ID
        public async Task<RecomendedWorkout?> GetByIdAsync(int id)
        {
            return await _context.recomended_workouts
                                 .Include(r => r.user)
                                 .FirstOrDefaultAsync(r => r.id == id);
        }

        // Get all workouts for a specific user
        public async Task<List<RecomendedWorkout>> GetByUserIdAsync(int userId)
        {
            return await _context.recomended_workouts
                                 .Where(r => r.user_id == userId)
                                 .ToListAsync();
        }

        // Add new workout
        public async Task AddAsync(RecomendedWorkout workout)
        {
            _context.recomended_workouts.Add(workout);
            await _context.SaveChangesAsync();
        }

        // Update existing workout
        public async Task UpdateAsync(RecomendedWorkout workout)
        {
            _context.recomended_workouts.Update(workout);
            await _context.SaveChangesAsync();
        }

        // Delete workout by ID
        public async Task DeleteAsync(int id)
        {
            var workout = await _context.recomended_workouts.FindAsync(id);
            if (workout != null)
            {
                _context.recomended_workouts.Remove(workout);
                await _context.SaveChangesAsync();
            }
        }

        // Check if workout exists
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.recomended_workouts.AnyAsync(r => r.id == id);
        }

        public async Task<List<RecomendedWorkout>> GetActiveRecomendedWorkoutsAsync(int userId)
        {
            return await _context.recomended_workouts
                               .Where(r => r.status == 1 && r.user_id == userId)
                               .ToListAsync();
        }

        public async Task DisactivateRecommendation(int id)
        {
            var recommendation = await GetByIdAsync(id);
            if (recommendation != null)
            {
                recommendation.status = 0;
                await UpdateAsync(recommendation);
            }
        }
    }
}
