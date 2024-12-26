namespace ChatbotApp.Server.Models;
record RequestModel(string prompt);

record ResponseModel(string @type, string text);