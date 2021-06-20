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
    public class PaymentsController : Controller
    {
        PaymentsList List;
        TenantsList TList;
        // GET: Payments
        [SessionAuthorization]
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult checkList(int ID)
        {
            ViewBag.ID = ID;
            return View();
        }
        [HttpPost]
        [PermissionAuthorization("22")]
        public JsonResult LoadAllTenants(TenantModel model)
        {
            List = new PaymentsList();
            List<TenantModel> modelList = new List<TenantModel>();
            modelList = List.LoadAllTenants(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);

        }


        [HttpPost]
        [PermissionAuthorization("19")]
        public JsonResult InsertPayment(PaymentsModel model)
        {
            List = new PaymentsList();
            int result = 0;
            result = List.InsertPayment(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("26")]
        public JsonResult LoadAllPaymentsByTenantsID(string TenantsID)
        {
            List = new PaymentsList();
            List<PaymentsModel> modelList = new List<PaymentsModel>();
            modelList = List.LoadAllPaymentsByTenantsID(TenantsID);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("20")]
        public JsonResult LoadSelectedPayment(int ID)
        {
            List = new PaymentsList();
            List<PaymentsModel> modelList = new List<PaymentsModel>();
            modelList = List.LoadSelectedPayment(ID);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("21")]
        public JsonResult DeletePayment(int ID)
        {
            List = new PaymentsList();
            int result = 0;
            result = List.DeletePayment(ID);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ChangeTenantsStatusByPayment(TenantModel model)
        {
            List = new PaymentsList();
            int result = 0;
            result = List.ChangeTenantsStatusByPayment(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [PermissionAuthorization("26")]
        public JsonResult LoadTenantsDetails(TenantModel model)
        {
            TList = new TenantsList();
            List<TenantModel> modelList = new List<TenantModel>();
            modelList = TList.LoadTenantsDetails(model);
            return Json(new { data = modelList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertPaymentVerification(PaymentsModel model)
        {
            List = new PaymentsList();
            int result = 0;
            result = List.InsertPaymentVerification(model);
            if (result != 0)
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
        }
    }

}