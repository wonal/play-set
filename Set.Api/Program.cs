using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Set.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<Repository>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

using (var serviceScope = app.Services.GetService<IServiceScopeFactory>().CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<Repository>();
    context.CreateTableIfNotExists();
    context.AddDateColumnIfNotExists();
    context.AddSeedColumnIfNotExists();
}

await app.RunAsync();
