using StayHousingLib;
using StayHousingModel;
using StayHousingWebApp.App_Start;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace StayHousingWebApp.Controllers
{
  
    public class TenantsController : Controller
    {
        TenantsList List;
        // GET: Tenants
        [SessionAuthorization]
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Details (int ID)
        {
            ViewBag.ID = ID;
            return View();
        }

        [HttpGet]
        public JsonResult LoadAllProperty()
        {
            List = new TenantsList();
            List<PropertyModel> modelList = new List<PropertyModel>();
            modelList = List.LoadAllProperty();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadRoomsByAddress(string PropertyID)
        {
            List = new TenantsList();
            List<PropertyRoomModel> modelList = new List<PropertyRoomModel>();
            modelList = List.LoadRoomsByAddress(PropertyID);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("9")]
        public JsonResult InsertTenant(TenantModel model)
        {
            JavaScriptSerializer json_serializer = new JavaScriptSerializer();

            List = new TenantsList();
            int results = 0;
            HttpPostedFileBase file = null;
            var fileName = "";
            var path = "";
            model.TenantsContactsList = json_serializer.Deserialize<List<Contacts>>(Request["TenantsContactsList"]);
            model.TenantsIssuesList = json_serializer.Deserialize<List<Issues>>(Request["TenantsIssuesList"]);
            model.CriminalConvictionsList = json_serializer.Deserialize<List<CriminalConvictions>>(Request["CriminalConvictionsList"]);
            model.SupportWorkerList = json_serializer.Deserialize<List<SupportWorkersModel>>(Request["SupportWorkerList"]);
            HttpPostedFileBase profilePic = Request.Files["image"];
            var docs = new List<HttpPostedFileBase>();
            List<TenantsDocuments> dlist = new List<TenantsDocuments>();

            if (profilePic!=null)
            {
                file = Request.Files[0];
                fileName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + file.FileName;
                path = Path.Combine(Server.MapPath("~/Content/Images"), fileName);
            }

            if (Request.Files.Count > 0)
            {
                

                if (profilePic != null)
                {
                    for(int i=1; i < Request.Files.Count; i++)
                    {
                        docs.Add(Request.Files[i]);
                        TenantsDocuments obj = new TenantsDocuments();
                        obj.ID = 0;
                        obj.TenantsID = "";
                        obj.Path = Path.Combine(Server.MapPath("~/Content/Images"), DateTime.Now.ToString("yyyyMMddHHmmssffff") + Request.Files[i].FileName);
                        obj.FilePath = "/Content/Images/" + DateTime.Now.ToString("yyyyMMddHHmmssffff") + Request.Files[i].FileName;
                        obj.DateAdded = "";
                        dlist.Add(obj);
                    }
                   
                }
                else
                {
                    for (int i = 0; i < Request.Files.Count; i++)
                    {
                        docs.Add(Request.Files[i]);
                        TenantsDocuments obj = new TenantsDocuments();
                        obj.ID = 0;
                        obj.TenantsID = "";
                        obj.Path = Path.Combine(Server.MapPath("~/Content/Images"), DateTime.Now.ToString("yyyyMMddHHmmssffff")+Request.Files[i].FileName);
                        obj.FilePath = "/Content/Images/"+DateTime.Now.ToString("yyyyMMddHHmmssffff")+Request.Files[i].FileName;
                        obj.DateAdded = "";
                        dlist.Add(obj);
                    }
                }
                model.TenantsDocumentsList = dlist;
            }

            if (path != "")
                model.ImagePath = "/Content/Images/" + fileName;
            else
                model.ImagePath = model.PreviousImage;

            List<TenantsDocuments> DocList = new List<TenantsDocuments>();
            if (model.ID > 0)
            {
                DocList = List.LoadSelectedTenant(model)[0].TenantsDocumentsList;
            }

            results = List.InsertTenant(model);

            if (results != 0)
            {
                if (path != "")
                {
                    try
                    {
                        if (model.ID > 0 && model.PreviousImage != "")
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

                if (dlist.Count > 0)
                {
                    if (model.ID > 0 && DocList.Count > 0)
                    {
                        for (int i = 0; i < DocList.Count; i++)
                        {
                            string droot = Server.MapPath("~" + DocList[i].FilePath);
                            if (System.IO.File.Exists(droot))
                            {
                                try
                                {
                                    System.IO.File.Delete(droot);
                                }
                                catch (Exception ex)
                                {
                                    throw ex;
                                }
                            }
                        }
                    }

                    for (int i = 0; i < model.TenantsDocumentsList.Count; i++)
                    {
                        try
                        {
                            docs[i].SaveAs(model.TenantsDocumentsList[i].Path);
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
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }

        }


        [HttpPost]
        [PermissionAuthorization("11")]
        public JsonResult DeleteTenant(TenantModel model)
        {
            List = new TenantsList();
            List<TenantModel> modelList = new List<TenantModel>();
            modelList = List.LoadSelectedTenant(model);
            int result = 0;
            result = List.DeleteTenant(modelList[0]);
            if (result != 0)
            {
                foreach (var u in modelList)
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
                foreach( var d in modelList[0].TenantsDocumentsList)
                {
                    string droot = Server.MapPath("~" + d.FilePath);
                    if (System.IO.File.Exists(droot))
                    {
                        try
                        {
                            System.IO.File.Delete(droot);
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

        [HttpGet]
        [PermissionAuthorization("12")]
        public JsonResult LoadAllTenants()
        {
            List = new TenantsList();
            List<TenantModel> modelList = new List<TenantModel>();
            modelList = List.LoadAllTenants();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("12")]
        public JsonResult FilterTenants(TenantModel model)
        {
            List = new TenantsList();
            List<TenantModel> modelList = new List<TenantModel>();
            modelList = List.FilterTenants(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("10")]
        public JsonResult LoadSelectedTenant(TenantModel model)
        {
            List = new TenantsList();
            List<TenantModel> modelList = new List<TenantModel>();
            modelList = List.LoadSelectedTenant(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadTenantByNI(TenantModel model)
        {
            List = new TenantsList();
            List<TenantModel> modelList = new List<TenantModel>();
            modelList = List.LoadTenantByNI(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ChangeTenantAddress(PropertyRoomModel model)
        {
            List = new TenantsList();
            int result = 0;
            result = List.ChangeTenantAddress(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult MoveToLeavers(TenantModel model)
        {
            List = new TenantsList();
            int result = 0;
            result = List.MoveToLeavers(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadPreviousAddressByTenantsID(TenantModel model)
        {
            List = new TenantsList();
            List<PropertyRoomModel> modelList = new List<PropertyRoomModel>();
            modelList = List.LoadPreviousAddressByTenantsID(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ChangeTenantsStatus(TenantModel model)
        {
            List = new TenantsList();
            int result = 0;
            result = List.ChangeTenantsStatus(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("25")]
        public JsonResult LoadTenantsDetails(TenantModel model)
        {
            List = new TenantsList();
            List<TenantModel> modelList = new List<TenantModel>();
            modelList = List.LoadTenantsDetails(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }
    }
}