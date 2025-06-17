using FitnessApp.Data;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories.Implementations
{
    public class ExistingWorkoutRepository : IExistingWorkoutRepository
    {
        private readonly FitnessAppDbContext _context;

        public ExistingWorkoutRepository(FitnessAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExistingWorkout>> GetAllAsync()
        {
            return await _context.existing_workouts.ToListAsync();
        }

        public async Task<ExistingWorkout?> GetByIdAsync(int id)
        {
            return await _context.existing_workouts.FindAsync(id);
        }

        public async Task AddAsync(ExistingWorkout workout)
        {
            _context.existing_workouts.Add(workout);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ExistingWorkout workout)
        {
            _context.existing_workouts.Update(workout);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var workout = await _context.existing_workouts.FindAsync(id);
            if (workout != null)
            {
                _context.existing_workouts.Remove(workout);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ExistingWorkout> GetByNameAsync(string name)
        {
            return await _context.existing_workouts.Where(e => e.name == name)
                .FirstAsync();
        }
    }
}
