using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using KMH_Project.DTO;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Security.Claims;

namespace KMH_Project.Controllers
{
    public class AccountsController : Controller
    {
        private string ApiServiceURL = string.Empty;
        public AccountsController(IConfiguration configuration)
        {
            ApiServiceURL = configuration.GetSection("UrlSettings").GetSection("liveAPIUrl").Value;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Index(LoginInfo loginInfo)
        {
            try
            {
                if (loginInfo.userName != null && loginInfo.password != null)
                {
                    var Status = string.Empty;
                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = new Uri(ApiServiceURL + "Accounts/Login");

                        //HTTP POST
                        client.DefaultRequestHeaders.Clear();
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        var post = client.PostAsJsonAsync<LoginInfo>("Login", loginInfo);
                        post.Wait();
                        var Result = post.Result;
                        if (Result.IsSuccessStatusCode)
                        {
                            var resultmessage = Result.Content.ReadAsStringAsync().Result;
                            var DeserilizeJsonObj = System.Text.Json.JsonSerializer.Deserialize<WebApiJsonResponse>(resultmessage);
                            Status = DeserilizeJsonObj.status.ToString();

                            if (Status == "True")
                            {
                                var jo = JObject.Parse(resultmessage);
                                var userName = jo["data"]["userName"].ToString();
                                var roleName = jo["data"]["roleName"].ToString();
                                var employeeId = jo["data"]["employeeId"].ToString();
                                var email = jo["data"]["email"].ToString();
                                var token = jo["data"]["token"].ToString();
                                
                                

                                HttpContext.Session.SetString("UserName", userName);
                                HttpContext.Session.SetString("RoleName", roleName);
                                HttpContext.Session.SetString("EmployeeID", employeeId);
                                HttpContext.Session.SetString("Email", email);
                                HttpContext.Session.SetString("token", token);
                               

                                return RedirectToAction("Index", "Dashboard");

                            }
                            else
                            {
                                ModelState.AddModelError("", "Invalid login details");
                            }
                        }
                    }
                }
                return View(loginInfo);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message.ToString());
                return View();
            }
        }

        [HttpGet]
        public JsonResult Session()
        {
            SessionDTO dto = new SessionDTO();
            dto.userName = HttpContext.Session.GetString("UserName").Trim();
            dto.roleName = HttpContext.Session.GetString("RoleName").Trim();
            dto.employeeId = HttpContext.Session.GetString("EmployeeID").Trim();
            dto.email = HttpContext.Session.GetString("Email").Trim();

            dto.token = HttpContext.Session.GetString("token").Trim();
           

            return Json(dto);
        }

        [HttpPost]
        public JsonResult Logout()
        {
            SignOut();
            HttpContext.Session.Clear();
            return Json(null);
        }
    }
}
