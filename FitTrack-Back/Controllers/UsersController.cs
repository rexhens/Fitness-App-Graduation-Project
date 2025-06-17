using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            await _userRepository.AddUserAsync(user);
            return CreatedAtAction(nameof(GetById), new { id = user.id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, User updatedUser)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
                return NotFound();

            existingUser.name = updatedUser.name;
            existingUser.surname = updatedUser.surname;
            existingUser.email = updatedUser.email;
            existingUser.password = updatedUser.password;

            await _userRepository.UpdateUserAsync(existingUser);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            await _userRepository.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
