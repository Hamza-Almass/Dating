using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using ZwajApp.API.Data;

namespace ZwajApp.API.Helpers
{
    public class LogLastActive : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var result = await next();
            var userId = int.Parse(result.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            // Get the repo
            var _repo = result.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user = await _repo.GetUser(userId);
            user.LastActive = DateTime.Now;
            await _repo.SaveAll();
        }
    }
}