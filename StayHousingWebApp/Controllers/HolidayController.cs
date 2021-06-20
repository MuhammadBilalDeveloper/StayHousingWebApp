using StayHousingCommon;
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
    public class HolidayController : Controller
    {
        // GET: Holiday
        HolidayList List;
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        //[PermissionAuthorization("40")]
        public JsonResult LoadAllHoliday(string Status)
        {
            List = new HolidayList();
            List<HolidayModel> modelList = new List<HolidayModel>();
            List<HolidayModel> modelListCount = new List<HolidayModel>();
            modelListCount = List.LoadHolidayCount(SessionVar.ID, SessionVar.GroupTitle);
            
            modelList = List.LoadAllHoliday(SessionVar.ID, SessionVar.GroupTitle);
            if (Status == "Booked")
                modelList = modelList.Where(x => x.IsApproved == false).ToList();
            if (Status == "Approved")
                modelList = modelList.Where(x => x.IsApproved == true && x.HolidayDate >= DateTime.Today).ToList();
            if (Status == "Taken")
                modelList = modelList.Where(x => x.IsApproved == true && x.HolidayDate < DateTime.Today).ToList();
            return Json(new { data = modelList,count= modelListCount }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        //[PermissionAuthorization("41")]
        public JsonResult InsertHoliday(HolidayModel model)
        {
            List = new HolidayList();
            int result = 0;
            model.IsActive = true;
            model.UserAccountID = Convert.ToInt32(SessionVar.ID);
            model.AddedBy = Convert.ToInt32(SessionVar.ID);
            result = List.InsertHoliday(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult InsertApproveHoliday(HolidayModel model)
        {
            List = new HolidayList();
            int result = 0;
            result = List.InsertApproveHoliday(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        //[PermissionAuthorization("42")]
        public JsonResult LoadSelectedHoliday(int ID)
        {
            List = new HolidayList();
            List<HolidayModel> modelList = new List<HolidayModel>();
            modelList = List.LoadSelectedHoliday(ID);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        //[PermissionAuthorization("43")]
        public JsonResult DeleteHoliday(int ID)
        {
            List = new HolidayList();
            int result = 0;
            result = List.DeleteHoliday(ID);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }


    }
}