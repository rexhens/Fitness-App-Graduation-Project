using FitnessApp.Models.Dto;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserRepository _usersRepository;
        private readonly IConfiguration _configuration;

        public AuthenticationController(IUserRepository usersRepository, IConfiguration configuration)
        {
            _usersRepository = usersRepository;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LogInDto loginDto)
        {
            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var user = await _usersRepository.GetUserByEmailAndPassword(loginDto.Email, loginDto.Password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Get API key from appsettings.json
            var apiKey = _configuration.GetValue<string>("OpenAI:ApiKey");
           

            return Ok(new LogInResponseDto { apikey = apiKey, userid = user.id});
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto signUpDto)
        {
            if (string.IsNullOrEmpty(signUpDto.email) || string.IsNullOrEmpty(signUpDto.password))
            {
                return BadRequest("Email and password are required.");
            }
            var user = await _usersRepository.GetUserByEmail(signUpDto.email);

            if (user != null)
            {
                return BadRequest("User exists");
            }
            User userEntity = new User { name = signUpDto.name, surname = signUpDto.surname, password = signUpDto.password, email = signUpDto.email };
            
            var userCreated = await _usersRepository.AddUserAsync(userEntity);
            var apiKey = _configuration.GetValue<string>("OpenAI:ApiKey");

            return Ok(new LogInResponseDto { apikey = apiKey, userid = userCreated.id });

        }
    }
}

