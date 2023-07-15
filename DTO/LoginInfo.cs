using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace KMH_Project.DTO
{
    public class LoginInfo
    {

        [Required]
        public string userName { get; set; }
        [Required]
        public string password { get; set; }
    }
}
