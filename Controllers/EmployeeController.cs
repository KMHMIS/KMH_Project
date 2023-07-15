using Microsoft.AspNetCore.Mvc;

namespace KMH_Project.Controllers
{
    public class EmployeeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
