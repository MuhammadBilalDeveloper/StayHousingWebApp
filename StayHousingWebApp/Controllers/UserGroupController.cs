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
    public class UserGroupController : Controller
    {
        // GET: UserGroup
        UserGroupList List;

        [SessionAuthorization]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [PermissionAuthorization("7")]
        public JsonResult LoadAllUserGroup()
        {
            List = new UserGroupList();
            List<UserGroupModel> modelList = new List<UserGroupModel>();
            modelList = List.LoadAllUserGroup();
            return Json(new { data = modelList},JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("1")]
        public JsonResult InsertUserGroup(UserGroupModel model)
        {
            List = new UserGroupList();
            int result = 0;
            result = List.InsertUserGroup(model);
            if(result!=0)
                return Json(new { success=true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [PermissionAuthorization("2")]
        public JsonResult LoadSelectedUserGroup(int ID)
        {
            List = new UserGroupList();
            List<UserGroupModel> modelList = new List<UserGroupModel>();
            modelList = List.LoadSelectedUserGroup(ID);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("3")]
        public JsonResult DeleteUserGroup(int ID)
        {
            List = new UserGroupList();
            int result = 0;
            result = List.DeleteUserGroup(ID);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadAllMenus(int ID)
        {
            List = new UserGroupList();
            List<MenuModel> modelList = new List<MenuModel>();
            modelList = List.LoadAllMenus(ID);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("23")]
        public JsonResult InsertGroupPermission(int ID,string menuIDs, int isChecked)
        {
            List = new UserGroupList();
            int result = 0;
            result = List.InsertGroupPermission(ID,menuIDs,isChecked);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
    }
}