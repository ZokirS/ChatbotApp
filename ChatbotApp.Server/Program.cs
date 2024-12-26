using ChatbotApp.Server.Models;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


var gptOptions = builder.Configuration
    .GetSection(nameof(GptOptions))
    .Get<GptOptions>();

builder.Services
    .AddKernel()
    .AddAzureOpenAIChatCompletion(gptOptions.Model, gptOptions.Endpoint, gptOptions.Key);

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.MapPost("/chat", async (RequestModel model, IChatCompletionService chatService) =>
{
    var chat = new ChatHistory();
    chat.AddMessage(AuthorRole.System, "You are an AI assistant that helps people find information realated to RFA company (rfa.com)");
    chat.AddAssistantMessage("short answer only");
    chat.AddUserMessage(model.prompt);
    var chatMessage = await chatService.GetChatMessageContentAsync(chat);
    var res = JsonConvert.SerializeObject(chatMessage.Items[0]);
    var result = JsonConvert.DeserializeObject<ResponseModel>(res);
    return result;
});
app.MapFallbackToFile("/index.html");

app.Run();

