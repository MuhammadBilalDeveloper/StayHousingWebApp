using Ionic.Zip;
using Ionic.Zlib;
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
    public class DashboardController : Controller
    {
        DashboardList List;
        // GET: Dashboard
        [SessionAuthorization]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PermissionDenied()
        {
            return View();
        }
        [SessionAuthorization]
        [PermissionAuthorization("34")]
        public ActionResult Backup()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadAllInitialData()
        {
            List = new DashboardList();
            List<DashboardModel> modelList = new List<DashboardModel>();
            modelList = List.LoadAllInitialData();
            if (!SessionVar.Menus.Split(',').Contains("27"))
            {
                modelList[0].TotalActiveTenants = 0;
                modelList[0].TotalClearedTenants = 0;
                modelList[0].TotalOutstandingTenants = 0;
            }
            
            if (!SessionVar.Menus.Split(',').Contains("28"))
            {
                modelList[0].TotalEmptyRooms = 0;
                modelList[0].TotalOccupiedRooms = 0;
            }

            if (!SessionVar.Menus.Split(',').Contains("29"))
            {
                modelList[0].MonthWiseAmountLIst = null;
            }

            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LoadExpiryCertificateNotificationData()
        {
            List = new DashboardList();
            List<ExpiryCertificateModel> modelList = new List<ExpiryCertificateModel>();
            modelList = List.LoadExpiryCertificateNotificationData();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertDBBackup()
        {
            List = new DashboardList();
            int result = 0;
            result = List.InsertDBBackup();
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult LoadLatestBDBak()
        {
            List = new DashboardList();
            List<DBbackupModel> modelList = new List<DBbackupModel>();
            modelList = List.LoadLatestBDBak();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        public FileResult DBBackupDownload(string fileName)
        {
            var path = Path.Combine(Server.MapPath("~/Bak/"), fileName);
            var fileStream = new FileStream(path, FileMode.Open);
            var fileStreamResult = File(fileStream, "application/octet-stream");
            fileStreamResult.FileDownloadName = fileName.Replace(' ', '_');

            return fileStreamResult;
        }

        [HttpPost]
        public JsonResult InsertFileBackup()
        {
            List = new DashboardList();
            int result = 0;
            result = List.InsertFileBackup();
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult LoadFileBackUp()
        {
            List = new DashboardList();
            List<DBbackupModel> modelList = new List<DBbackupModel>();
            modelList = List.LoadFileBackUp();
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        public void FileStorageDownload()
        {
            Response.Clear();
            Response.BufferOutput = false;
            Response.ContentType = "application/zip";
            List = new DashboardList();
            List<DBbackupModel> modelList = new List<DBbackupModel>();
            modelList = List.LoadFileBackUp();

            Response.AddHeader("content-disposition", "attachment; filename="+modelList[0].FilePath.Replace(' ','_'));

            using (ZipFile zip = new ZipFile())
            {
                zip.CompressionLevel = CompressionLevel.None;
                zip.AddSelectedFiles("*", Server.MapPath("~/Content/Images/"), "", false);
                zip.Save(Response.OutputStream);
              
            }

            Response.Close();
        }

    }
}