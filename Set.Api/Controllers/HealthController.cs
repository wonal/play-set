using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SetApi.Models;

namespace Set.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        /*
        private readonly PlayerContext context;

        public HealthController(PlayerContext context)
        {
            this.context = context;
        }

        private bool CheckDBHealth()
        {
            try
            {
                context.Players.Take(1).ToList();
                return true;
            }
            catch
            { return false; }
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Ok(new { Version = 1, DBHealth = CheckDBHealth() });
        }
        */
    }
}