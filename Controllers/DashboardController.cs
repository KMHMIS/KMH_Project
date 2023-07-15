using Microsoft.AspNetCore.Mvc;

namespace KMH_Project.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
