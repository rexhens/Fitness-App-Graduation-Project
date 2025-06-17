using FitnessApp.Models.Dto;
using FitnessApp.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using FitnessApp.Repositories.Implementations;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientCallController : Controller
    {
        private readonly IConversationRepository _conversatioonsRepository;
        private readonly IMessagesRepository _messagesRepository;
        private readonly IConfiguration _config;

        public ClientCallController(IConfiguration config,
            IConversationRepository conversatioonsRepository, IMessagesRepository messageRepository)
        {
            _config = config;
            _conversatioonsRepository = conversatioonsRepository;
            _messagesRepository = messageRepository;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> CallOpenAIApiAsync([FromBody] UserQuestion userQuestion, int user_id)
        {
            if (string.IsNullOrWhiteSpace(userQuestion.question))
                return BadRequest("Question cannot be empty.");

            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "OpenAI API key not configured.");

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var previousConversation = await _conversatioonsRepository.GetByClientIdAsync(user_id);

            var messages = new List<object>();
            Conversation new_conversation = null;

            messages.Add(new { role = "system", content = "You are a fitness assistant for beginners. Provide clear, concise and supportive advice.Do not answer non fitness related content questions.Answer only to the last question asked. " });

            //If there exist conversation for that user that contain messages
            if (previousConversation != null)
            {
                if (previousConversation.messages != null)
                {
                    foreach (var message in previousConversation.messages)
                    {
                        messages.Add(new
                        {
                            role = message.is_user_message() ? "user" : "system",
                            content = message.message
                        });
                    }
                }
            }
            else
            {
                new_conversation = new Conversation { user_id = user_id, title = "user " + user_id + " conversation" };
                await _conversatioonsRepository.AddAsync(new_conversation);
            }
            messages.Add(new { role = "user", content = userQuestion.question });
            var payload = new
            {
                model = "gpt-4o",
                messages
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
            if (new_conversation != null)
            {
                await _messagesRepository.SaveMessage(userQuestion.question, "user", new_conversation.id);
                await _messagesRepository.SaveMessage(reply, "system", new_conversation.id);
            }
            else
            {
                await _messagesRepository.SaveMessage(userQuestion.question, "user", previousConversation.id);
                await _messagesRepository.SaveMessage(reply, "system", previousConversation.id);

            }
            return Ok(new { message = reply });
        }

        [HttpGet("get-all-messages")]
        public async Task<IActionResult> GetALlMessagesOfUser([FromQuery] int userId)
        {
            var conversation = await _conversatioonsRepository.GetByClientIdAsync(userId);
            if (conversation == null)
            {
                return NotFound("There are no conversations for this user");
            }
            var messages = await _messagesRepository.GetByConversationIdAsync(conversation.id);
            if (messages == null)
            {
                return NotFound("There are no messages for this user!");
            }
            return Ok(messages);
        }
    }
}
