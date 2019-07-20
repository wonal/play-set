using Microsoft.AspNetCore.Mvc;

namespace Set.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly Repository repository;

        public HealthController(Repository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Ok(new { Version = 3, DBHealth = repository.CheckDBHealth() });
        }
    }
}