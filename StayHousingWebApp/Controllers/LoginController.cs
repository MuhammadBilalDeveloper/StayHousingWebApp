using StayHousingCommon;
using StayHousingLib;
using StayHousingModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StayHousingWebApp.Controllers
{
    public class LoginController : Controller
    {
        UserAccountList List;
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetLoginInfo(UserAccountModel Model)
        {
            List = new UserAccountList();
            List<UserAccountModel> ModelList = new List<UserAccountModel>();
            ModelList = List.GetLoginInfo(Model);
            if (ModelList.Count > 0)
            {
                SessionVar.ID = ModelList[0].ID.ToString();
                SessionVar.UserID = ModelList[0].EmployeeCode.ToString();
                SessionVar.Email = ModelList[0].Email.ToString();
                SessionVar.Phone = ModelList[0].Phone.ToString();
                SessionVar.FirstName = ModelList[0].FirstName.ToString();
                SessionVar.MiddleName = ModelList[0].MiddleName.ToString();
                SessionVar.Surname = ModelList[0].SurName.ToString();
                SessionVar.ImagePath = ModelList[0].ImagePath.ToString();
                SessionVar.GroupID = ModelList[0].GroupID.ToString();
                SessionVar.GroupTitle = ModelList[0].GroupTitle.ToString();
                SessionVar.Menus = ModelList[0].Menus.ToString();
                SessionVar.Company = ModelList[0].Company.ToString();
                SessionVar.CompanyName = ModelList[0].CompanyName.ToString();


                return Json(new { success = true,message="Login Success!" },JsonRequestBehavior.DenyGet);
            }
            else
            {
                return Json(new { success = false, message = "Login Failed! Please try again." }, JsonRequestBehavior.DenyGet);
            }
        }

        [HttpPost]
        public JsonResult LogOutUser()
        {
            try
            {
                SessionVar.ID = "";
                SessionVar.UserID = "";
                SessionVar.Email = "";
                SessionVar.Phone = "";
                SessionVar.FirstName ="";
                SessionVar.MiddleName = "";
                SessionVar.Surname = "";
                SessionVar.ImagePath = "";
                SessionVar.GroupID = "";
                SessionVar.GroupTitle = "";
                Session.Clear();
                return Json(new { success = "True" });
            }
            catch (Exception ex)
            {
                return Json(new { success = "False" });
            }
        }
    }
}