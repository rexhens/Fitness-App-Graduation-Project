using FitnessApp.Data;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories.Implementations
{
    public class UsersRepository : IUserRepository
    {
        private readonly FitnessAppDbContext _context;

        public UsersRepository(FitnessAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.users.ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.users.FindAsync(id);
        }

        public async Task<User> AddUserAsync(User user)
        {
            _context.users.Add(user);
            await _context.SaveChangesAsync();
            return await GetUserByEmail(user.email);

        }

        public async Task UpdateUserAsync(User user)
        {
            _context.users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user != null)
            {
                _context.users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<User> GetUserByEmailAndPassword(string email, string password)
        {
            return await _context.users
                 .Where(user => user.email == email && user.password == password)
                 .FirstOrDefaultAsync();
        }
        public async Task<User> GetUserByEmail(string email)
        {
            return await _context.users
                 .Where(user => user.email == email)
                 .FirstOrDefaultAsync();
        }
    }
}
