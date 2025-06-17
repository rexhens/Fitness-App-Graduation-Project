using FitnessApp.Data;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories.Implementations
{
    public class PhysicalMetricsRepository : IPhysicalMetricsRepository
    {
        
            private readonly FitnessAppDbContext _context;

            public PhysicalMetricsRepository(FitnessAppDbContext context)
            {
                _context = context;
            }

            public async Task<IEnumerable<PhysicalMetrics>> GetAllAsync()
            {
                return await _context.physical_metrics
                    .Include(p => p.user)
                    .ToListAsync();
            }

            public async Task<PhysicalMetrics?> GetByIdAsync(int id)
            {
                return await _context.physical_metrics
                    .Include(p => p.user)
                    .FirstOrDefaultAsync(p => p.id == id);
            }

        public async Task<PhysicalMetrics> GetByUserIdAsync(int user_id)
        {
            return await _context.physical_metrics
                .Where(p => p.user_id == user_id)
                .Include(p => p.user)
                .FirstOrDefaultAsync();
        }
            public async Task AddAsync(PhysicalMetrics metrics)
            {
                await _context.physical_metrics.AddAsync(metrics);
                await _context.SaveChangesAsync();
            }

            public async Task UpdateAsync(PhysicalMetrics metrics)
            {
                _context.physical_metrics.Update(metrics);
                await _context.SaveChangesAsync();
            }

            public async Task DeleteAsync(int id)
            {
                var metrics = await _context.physical_metrics.FindAsync(id);
                if (metrics != null)
                {
                    _context.physical_metrics.Remove(metrics);
                    await _context.SaveChangesAsync();
                }
            }
        }
    }

