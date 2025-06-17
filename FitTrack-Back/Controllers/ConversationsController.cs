using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.Controllers
{

    [ApiController]
    [Route("/conversations")]
    public class ConversationsController : ControllerBase
    {
        private readonly IConversationRepository _conversationRepository;

        // Constructor to inject the conversation repository
        public ConversationsController(IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }
        [HttpGet("/all")]

        // Action to display all conversations
        public async Task<IActionResult> Index()
        {
            var conversations = await _conversationRepository.GetAllAsync();
            return Ok(conversations);
        }

    }
}
