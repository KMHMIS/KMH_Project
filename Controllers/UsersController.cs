using Microsoft.AspNetCore.Mvc;

namespace KMH_Project.Controllers
{
    public class UsersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
