using Microsoft.AspNetCore.Mvc;

namespace KMH_Project.Controllers
{
    public class DepartmentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
