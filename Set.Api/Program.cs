using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Set.Api;
using Set.Api.Multiplayer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<Repository>();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddSingleton<MultiplayerGameHandler>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.MapHub<GameHub>("/multiplayer");

using (var serviceScope = app.Services.GetService<IServiceScopeFactory>().CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<Repository>();
    context.CreateTableIfNotExists();
}

await app.RunAsync();
