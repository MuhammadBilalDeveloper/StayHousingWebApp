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
    public class PropertyController : Controller
    {
        PropertyList List;
        // GET: Property
        [SessionAuthorization]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Details(int ID)
        {
            ViewBag.ID = ID;
            return View();
        }

        [HttpPost]
        [PermissionAuthorization("13")]
        public JsonResult InsertProperty(PropertyModel model)
        {
            List = new PropertyList();
            string result = "";
            result = List.InsertProperty(model);
            if (result != "Failed" || result!="")
                return Json(new { success = true,data=result }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false, data = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("16")]
        public JsonResult DeleteProperty(PropertyModel model)
        {
            List = new PropertyList();
            int result = 0;
            List<PropertyImagesModel> ImgModelList = new List<PropertyImagesModel>();
            PropertyImagesModel imgModel = new PropertyImagesModel();
            imgModel.PropertyID = model.PropertyID;
            ImgModelList = List.LoadPropertyImages(imgModel);

            List<PropertyCertificatesModel> CertificateModelList = new List<PropertyCertificatesModel>();
            PropertyCertificatesModel certModel = new PropertyCertificatesModel();
            certModel.PropertyID = model.PropertyID;
            CertificateModelList = List.LoadPropertyCertificates(certModel);

            List<PropertyLandlorIDsModel> LandlordModelList = new List<PropertyLandlorIDsModel>();
            PropertyLandlorIDsModel landModel = new PropertyLandlorIDsModel();
            landModel.PropertyID = model.PropertyID;
            LandlordModelList = List.LoadPropertyLandlordIDs(landModel);

            result = List.DeleteProperty(model);
            if (result != 0)
            {                
                foreach(var i in ImgModelList)
                {
                    string root = Server.MapPath("~" + i.ImagePath);
                    deleteImage(root);
                }
                foreach (var i in CertificateModelList)
                {
                    string root = Server.MapPath("~" + i.FilePath);
                    deleteImage(root);
                }
                foreach (var i in LandlordModelList)
                {
                    string root = Server.MapPath("~" + i.FilePath);
                    deleteImage(root);
                }
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        private void deleteImage(string path)
        {
            try
            {
                System.IO.File.Delete(path);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public JsonResult LoadAllPropertyType()
        {
            List = new PropertyList();
            List<PropertyTypeModel> modelList = new List<PropertyTypeModel>();
            modelList = List.LoadAllPropertyType();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [PermissionAuthorization("18")]
        public JsonResult LoadAllProperty(PropertyModel model)
        {
            List = new PropertyList();
            List<PropertyModel> modelList = new List<PropertyModel>();
            modelList = List.LoadAllProperty(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("24")]
        public JsonResult LoadPropertyDetails(PropertyModel model)
        {
            List = new PropertyList();
            List<PropertyModel> modelList = new List<PropertyModel>();
            modelList = List.LoadPropertyDetails(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("15")]
        public JsonResult LoadSelectedProperty(PropertyModel model)
        {
            List = new PropertyList();
            List<PropertyModel> modelList = new List<PropertyModel>();
            modelList = List.LoadSelectedProperty(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertPropertyImages(PropertyImagesModel model)
        {
            List = new PropertyList();
            int result = 0;
            HttpPostedFileBase file = null;
            var fileName = "";
            var path = "";

            if (Request.Files.Count > 0 && model.PropertyID!=null)
            {
                for(int i = 0; i < Request.Files.Count; i++)
                {
                    file = Request.Files[i];
                    fileName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + file.FileName;
                    path = Path.Combine(Server.MapPath("~/Content/Images"), fileName);
                    model.ImagePath = "/Content/Images/" + fileName;
                    result = List.InsertPropertyImages(model);
                    if (result != 0)
                    {
                        try
                        {
                            file.SaveAs(path);

                        }
                        catch (Exception ex)
                        {

                            throw ex;
                        }
                    }
                }
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult LoadPropertyImages(PropertyImagesModel model)
        {
            List = new PropertyList();
            List<PropertyImagesModel> modelList = new List<PropertyImagesModel>();
            modelList = List.LoadPropertyImages(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeletePropertyImage(PropertyImagesModel model)
        {
            List = new PropertyList();
            int result = 0;
            result = List.DeletePropertyImage(model);
            if (result != 0)
            {
                string root = Server.MapPath("~" + model.ImagePath);
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
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertPropertyCertificates(PropertyCertificatesModel model)
        {
            List = new PropertyList();
            int result = 0;
            HttpPostedFileBase file = null;
            var fileName = "";
            var path = "";

            if (Request.Files.Count > 0 && model.PropertyID != null)
            {
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    file = Request.Files[i];
                    fileName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + file.FileName;
                    path = Path.Combine(Server.MapPath("~/Content/Images"), fileName);
                    model.FilePath = "/Content/Images/" + fileName;
                    result = List.InsertPropertyCertificates(model);
                    if (result != 0)
                    {
                        try
                        {
                            file.SaveAs(path);

                        }
                        catch (Exception ex)
                        {

                            throw ex;
                        }
                    }
                }
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult LoadPropertyCertificates(PropertyCertificatesModel model)
        {
            List = new PropertyList();
            List<PropertyCertificatesModel> modelList = new List<PropertyCertificatesModel>();
            modelList = List.LoadPropertyCertificates(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeletePropertyCertificate(PropertyCertificatesModel model)
        {
            List = new PropertyList();
            int result = 0;
            result = List.DeletePropertyCertificate(model);
            if (result != 0)
            {
                string root = Server.MapPath("~" + model.FilePath);
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
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertPropertyLandlordID(PropertyLandlorIDsModel model)
        {
            List = new PropertyList();
            int result = 0;
            HttpPostedFileBase file = null;
            var fileName = "";
            var path = "";

            if (Request.Files.Count > 0 && model.PropertyID != null)
            {
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    file = Request.Files[i];
                    fileName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + file.FileName;
                    path = Path.Combine(Server.MapPath("~/Content/Images"), fileName);
                    model.FilePath = "/Content/Images/" + fileName;
                    result = List.InsertPropertyLandlordID(model);
                    if (result != 0)
                    {
                        try
                        {
                            file.SaveAs(path);

                        }
                        catch (Exception ex)
                        {

                            throw ex;
                        }
                    }
                }
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult LoadPropertyLandlordIDs(PropertyLandlorIDsModel model)
        {
            List = new PropertyList();
            List<PropertyLandlorIDsModel> modelList = new List<PropertyLandlorIDsModel>();
            modelList = List.LoadPropertyLandlordIDs(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeletePropertyLandlordID(PropertyLandlorIDsModel model)
        {
            List = new PropertyList();
            int result = 0;
            result = List.DeletePropertyLandlordID(model);
            if (result != 0)
            {
                string root = Server.MapPath("~" + model.FilePath);
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
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
    }
}