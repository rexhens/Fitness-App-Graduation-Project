using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using FitnessApp.Repositories;
using FitnessApp.Models.Dto;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientCallFolderHistoryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly FileConversationRepository _fileConversationRepository;

        public ClientCallFolderHistoryController(IConfiguration config, FileConversationRepository fileConversationRepository)
        {
            _config = config;
            _fileConversationRepository = fileConversationRepository;
        }


        [HttpPost("ask")]
        public async Task<IActionResult> CallOpenAIApiAsync([FromBody] UserQuestion userQuestion)
        {
            if (string.IsNullOrWhiteSpace(userQuestion.question))
                return BadRequest("Question cannot be empty.");

            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "OpenAI API key not configured.");

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            string previousConversations = await _fileConversationRepository.GetPreviousConversationsAsync(apiKey);

            var payload = new
            {
                model = "gpt-4o",
                messages = string.IsNullOrEmpty(previousConversations)
            ? new[] {
                new { role = "system", content = "You are a fitness assistant for beginners. Provide clear, concise and supportive advice.Do not answer non fitness related content questions" },
                new { role = "user", content = userQuestion.question }
            }
            : JsonSerializer.Deserialize<object[]>(previousConversations)
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            if (doc.RootElement.TryGetProperty("error", out var error))
            {
                var message = error.GetProperty("message").GetString();
                return StatusCode(500, $"OpenAI Error: {message}");
            }



            var reply = doc.RootElement
                           .GetProperty("choices")[0]
                           .GetProperty("message")
                           .GetProperty("content")
                           .GetString();

            await _fileConversationRepository.SaveConversationToJsonAsync(userQuestion.question, reply);

            return Ok(reply);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetConversationHistory(string userId)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Conversations", $"{userId}.json");

            if (!System.IO.File.Exists(filePath))
                return NotFound("No conversation history found for this user.");

            var json = await System.IO.File.ReadAllTextAsync(filePath);
            return Content(json, "application/json");
        }


        [HttpPost("ask-with-db-memory")]
        public async Task<IActionResult> CallOpenAIApiWithDBMessagesAsync([FromBody] UserQuestion userQuestion)
        {
            if (string.IsNullOrWhiteSpace(userQuestion.question))

                return BadRequest("Question cannot be empty.");

            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "OpenAI API key not configured.");

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            string previousConversations = await _fileConversationRepository.GetPreviousConversationsAsync(apiKey);

            var payload = new
            {
                model = "gpt-4o",
                messages = string.IsNullOrEmpty(previousConversations)
            ? new[] {
                new { role = "system", content = "You are a fitness assistant for beginners. Provide clear and supportive advice." },
                new { role = "user", content = userQuestion.question }
            }
            : JsonSerializer.Deserialize<object[]>(previousConversations)
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            if (doc.RootElement.TryGetProperty("error", out var error))
            {
                var message = error.GetProperty("message").GetString();
                return StatusCode(500, $"OpenAI Error: {message}");
            }



            var reply = doc.RootElement
                           .GetProperty("choices")[0]
                           .GetProperty("message")
                           .GetProperty("content")
                           .GetString();

            await _fileConversationRepository.SaveConversationToJsonAsync(userQuestion.question, reply);

            return Ok(reply);
        }
    }
}
