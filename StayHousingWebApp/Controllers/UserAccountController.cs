using StayHousingCommon;
using StayHousingLib;
using StayHousingModel;
using StayHousingWebApp.App_Start;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StayHousingWebApp.Controllers
{
    public class UserAccountController : Controller
    {
        // GET: UserAccount
        UserAccountList List;

        [SessionAuthorization]
        public ActionResult Index()
        {
            return View();
        }

        [SessionAuthorization]
        public ActionResult MyAccount()
        {
            return View();
        }

        [HttpGet]
        [PermissionAuthorization("8")]
        public JsonResult LoadAllUserAccount()
        {
            List = new UserAccountList();
            List<UserAccountModel> modelList = new List<UserAccountModel>();
            modelList = List.LoadAllUserAccounts();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LoadAllUserGroup()
        {
            List = new UserAccountList();
            List<UserGroupModel> modelList = new List<UserGroupModel>();
            modelList = List.LoadAllUserGroup();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("4")]
        public JsonResult InsertUserAccount(UserAccountModel model)
        {
            List = new UserAccountList();
            int results = 0;
            HttpPostedFileBase file=null;
            var fileName = "";
            var path = "";

            if (Request.Files.Count > 0)
            {
                file = Request.Files[0];
                fileName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + file.FileName;
                path = Path.Combine(Server.MapPath("~/Content/Images"), fileName);
            }

            if (path != "")
                model.ImagePath = "/Content/Images/" + fileName;
            else
                model.ImagePath = model.PreviousImage;

            results = List.InsertUserAccount(model);

            if (results != 0)
            {
                if (path != "")
                {                    
                    try
                    {
                        if (model.ID > 0 && model.PreviousImage!="")
                        {
                            string root = Server.MapPath("~" + model.PreviousImage);
                            if (System.IO.File.Exists(root))
                            {
                                try
                                {

                                    System.IO.File.Delete(root);
                                }catch(Exception ex)
                                {
                                    throw ex;
                                }
                            }
                        }
                        
                        file.SaveAs(path);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        [PermissionAuthorization("5")]
        public JsonResult LoadSelectedUserAccount(int ID)
        {
            List = new UserAccountList();
            List<UserAccountModel> modelList = new List<UserAccountModel>();
            modelList = List.LoadSelectedUserAccount(ID);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("6")]
        public JsonResult DeleteUserAccount(int ID)
        {
            List = new UserAccountList();
            List<UserAccountModel> modelList = new List<UserAccountModel>();
            modelList = List.LoadSelectedUserAccount(ID);
            int result = 0;
            result = List.DeleteUserAccount(ID);
            if (result != 0)
            {                
                foreach(var u in modelList)
                {
                    string root = Server.MapPath("~" + u.ImagePath);
                    if (System.IO.File.Exists(root))
                    {
                        try
                        {
                            System.IO.File.Delete(root);
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                }
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }


        // *****My Account ****** //

        [HttpGet]
        public JsonResult GetUserBasicInformation()
        {
            List = new UserAccountList();
            List<UserAccountModel> modelList = new List<UserAccountModel>();
            if (SessionVar.ID != null)
            {

                modelList = List.LoadSelectedUserAccount(Convert.ToInt32(SessionVar.ID));
                return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { data = "" }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult UpdateBasicInformation(UserAccountModel model)
        {
            List = new UserAccountList();
            int results = 0;
            HttpPostedFileBase file = null;
            var fileName = "";
            var path = "";

            if (Request.Files.Count > 0)
            {
                file = Request.Files[0];
                fileName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + file.FileName;
                path = Path.Combine(Server.MapPath("~/Content/Images"), fileName);
            }

            if (path != "")
                model.ImagePath = "/Content/Images/" + fileName;
            else
                model.ImagePath = model.PreviousImage;

            if(SessionVar.ID!=null)
                results = List.UpdateBasicInformation(model);

            if (results != 0)
            {
                if (path != "")
                {
                    SessionVar.ImagePath = "/Content/Images/" + fileName;
                    try
                    {
                        if (model.PreviousImage != "")
                        {
                            string root = Server.MapPath("~" + model.PreviousImage);
                            if (System.IO.File.Exists(root))
                            {
                                try
                                {

                                    System.IO.File.Delete(root);
                                }
                                catch (Exception ex)
                                {
                                    throw ex;
                                }
                            }
                        }

                        file.SaveAs(path);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

        }




    }
}