using Microsoft.AspNetCore.Mvc;

namespace KMH_Project.Controllers
{
    public class FormController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
