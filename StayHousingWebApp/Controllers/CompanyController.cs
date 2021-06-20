using StayHousingLib;
using StayHousingModel;
using StayHousingWebApp.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StayHousingWebApp.Controllers
{
    public class CompanyController : Controller
    {
        CompanyList List;
        // GET: Company
        [PermissionAuthorization("36")]
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult LoadAllCompany()
        {
            List = new CompanyList();
            List<CompanyModel> modelList = new List<CompanyModel>();
            modelList = List.LoadAllCompany();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("37")]
        public JsonResult InsertCompany(CompanyModel model)
        {
            List = new CompanyList();
            int result = 0;
            result = List.InsertCompany(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [PermissionAuthorization("38")]
        public JsonResult LoadSelectedCompany(string ID)
        {
            List = new CompanyList();
            List<CompanyModel> modelList = new List<CompanyModel>();
            modelList = List.LoadSelectedCompany(ID);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("39")]
        public JsonResult DeleteCompany(string ID)
        {
            List = new CompanyList();
            int result = 0;
            result = List.DeleteCompany(ID);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
    }
}