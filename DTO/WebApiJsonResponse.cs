namespace KMH_Project.DTO
{
    public class WebApiJsonResponse
    {
        public bool status { get; set; }
        public string message { get; set; }
        public dynamic data { get; set; }
    }
}
