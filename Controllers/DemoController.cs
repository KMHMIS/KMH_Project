﻿using Microsoft.AspNetCore.Mvc;

namespace KMH_Project.Controllers
{
    public class DemoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
