using Microsoft.Reporting.WebForms;
using StayHousingCommon;
using StayHousingWebApp.App_Start;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StayHousingWebApp.Controllers
{
    public class ReportController : Controller
    {
        // GET: Report
        [SessionAuthorization]
        public ActionResult Index()
        {
            return View();
        }

        [PermissionAuthorization("30")]
        public ActionResult UserReport(string isActive)
        {

            DataSet ds = new DataSet();
            DataTable dtData = new DataTable();
            SqlDataAdapter sqlDa = new SqlDataAdapter();
            LocalReport localReport = new LocalReport();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();

            SqlCommand dCmd = new SqlCommand("SP_REPORTS", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.Parameters.AddWithValue("@QueryOption", 1);
            if (isActive=="ALL")
                dCmd.Parameters.AddWithValue("@IsActive", "");
            else if (isActive== "Active")
                dCmd.Parameters.AddWithValue("@IsActive", 1);
            else if (isActive== "Inactive")
                dCmd.Parameters.AddWithValue("@IsActive", 0);

            sqlDa.SelectCommand = dCmd;
            sqlDa.Fill(ds);

            localReport.ReportPath = Server.MapPath("~/Reports/UserReport.rdlc");
            ReportDataSource reportDataSource = new ReportDataSource();

            reportDataSource.Name = "USP_USERS";
            reportDataSource.Value = ds.Tables[0];
            if (ds.Tables[0].Rows.Count > 0)
            {
                //ReportParameter PFromDate = new ReportParameter("FromDate", FromDate);
                //ReportParameter PToDate = new ReportParameter("ToDate", ToDate);
                //ReportParameter CompanyName = new ReportParameter("CompanyName", companyName);

                //localReport.SetParameters(new ReportParameter[] { PFromDate, PToDate, CompanyName });
                localReport.Refresh();
                localReport.DataSources.Add(reportDataSource);
                string reportType = "EXCELOPENXML";
                string mimeType;
                string encoding;
                string fileNameExtension;
                //The DeviceInfo settings should be changed based on the reportType            
                //http://msdn2.microsoft.com/en-us/library/ms155397.aspx            
                string deviceInfo = "<DeviceInfo>" +
                    "  <OutputFormat>EXCEL</OutputFormat>" +
                    "  <PageWidth>11.69in</PageWidth>" +
                    "  <PageHeight>8.27in </PageHeight>" +
                    "  <MarginTop>.25 in</MarginTop>" +
                    "  <MarginLeft>.25 in</MarginLeft>" +
                    "  <MarginRight>.25 in</MarginRight>" +
                    "  <MarginBottom>.25 in</MarginBottom>" +
                    "</DeviceInfo>";
                Warning[] warnings;
                string[] streams;
                byte[] renderedBytes;
                //Render the report            
                renderedBytes = localReport.Render(reportType, deviceInfo, out mimeType, out encoding, out fileNameExtension, out streams, out warnings);

                //return Json(File(renderedBytes, mimeType), JsonRequestBehavior.AllowGet);
                return File(renderedBytes, mimeType);
            }
            else
            {
                return View("~/Views/Shared/NoDataFound.cshtml");
            }
        }

        [PermissionAuthorization("31")]
        public ActionResult PropertyReport(string Status)
        {

            DataSet ds = new DataSet();
            DataTable dtData = new DataTable();
            SqlDataAdapter sqlDa = new SqlDataAdapter();
            LocalReport localReport = new LocalReport();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();

            SqlCommand dCmd = new SqlCommand("SP_REPORTS", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.Parameters.AddWithValue("@QueryOption", 2);
            dCmd.Parameters.AddWithValue("@Status", Status);

            sqlDa.SelectCommand = dCmd;
            sqlDa.Fill(ds);

            localReport.ReportPath = Server.MapPath("~/Reports/PropertyReport.rdlc");
            ReportDataSource reportDataSource = new ReportDataSource();

            reportDataSource.Name = "USP_PROPERTY";
            reportDataSource.Value = ds.Tables[0];
            if (ds.Tables[0].Rows.Count > 0)
            {
                //ReportParameter PFromDate = new ReportParameter("FromDate", FromDate);
                //ReportParameter PToDate = new ReportParameter("ToDate", ToDate);
                //ReportParameter CompanyName = new ReportParameter("CompanyName", companyName);

                //localReport.SetParameters(new ReportParameter[] { PFromDate, PToDate, CompanyName });
                localReport.Refresh();
                localReport.DataSources.Add(reportDataSource);
                string reportType = "EXCELOPENXML";
                string mimeType;
                string encoding;
                string fileNameExtension;
                //The DeviceInfo settings should be changed based on the reportType            
                //http://msdn2.microsoft.com/en-us/library/ms155397.aspx            
                string deviceInfo = "<DeviceInfo>" +
                    "  <OutputFormat>EXCEL</OutputFormat>" +
                    "  <PageWidth>11.69in</PageWidth>" +
                    "  <PageHeight>8.27in </PageHeight>" +
                    "  <MarginTop>.25 in</MarginTop>" +
                    "  <MarginLeft>.25 in</MarginLeft>" +
                    "  <MarginRight>.25 in</MarginRight>" +
                    "  <MarginBottom>.25 in</MarginBottom>" +
                    "</DeviceInfo>";
                Warning[] warnings;
                string[] streams;
                byte[] renderedBytes;
                //Render the report            
                renderedBytes = localReport.Render(reportType, deviceInfo, out mimeType, out encoding, out fileNameExtension, out streams, out warnings);

                //return Json(File(renderedBytes, mimeType), JsonRequestBehavior.AllowGet);
                return File(renderedBytes, mimeType);
            }
            else
            {
                return View("~/Views/Shared/NoDataFound.cshtml");
            }
        }

        [PermissionAuthorization("32")]
        public ActionResult TenantReport(string Status)
        {

            DataSet ds = new DataSet();
            DataTable dtData = new DataTable();
            SqlDataAdapter sqlDa = new SqlDataAdapter();
            LocalReport localReport = new LocalReport();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();

            SqlCommand dCmd = new SqlCommand("SP_REPORTS", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.Parameters.AddWithValue("@QueryOption", 3);
            dCmd.Parameters.AddWithValue("@Status", Status);

            sqlDa.SelectCommand = dCmd;
            sqlDa.Fill(ds);

            localReport.ReportPath = Server.MapPath("~/Reports/TenantReport.rdlc");
            ReportDataSource reportDataSource = new ReportDataSource();

            reportDataSource.Name = "USP_TENANT";
            reportDataSource.Value = ds.Tables[0];
            if (ds.Tables[0].Rows.Count > 0)
            {
                //ReportParameter PFromDate = new ReportParameter("FromDate", FromDate);
                //ReportParameter PToDate = new ReportParameter("ToDate", ToDate);
                //ReportParameter CompanyName = new ReportParameter("CompanyName", companyName);

                //localReport.SetParameters(new ReportParameter[] { PFromDate, PToDate, CompanyName });
                localReport.Refresh();
                localReport.DataSources.Add(reportDataSource);
                string reportType = "EXCELOPENXML";
                string mimeType;
                string encoding;
                string fileNameExtension;
                //The DeviceInfo settings should be changed based on the reportType            
                //http://msdn2.microsoft.com/en-us/library/ms155397.aspx            
                string deviceInfo = "<DeviceInfo>" +
                    "  <OutputFormat>EXCEL</OutputFormat>" +
                    "  <PageWidth>11.69in</PageWidth>" +
                    "  <PageHeight>8.27in </PageHeight>" +
                    "  <MarginTop>.25 in</MarginTop>" +
                    "  <MarginLeft>.25 in</MarginLeft>" +
                    "  <MarginRight>.25 in</MarginRight>" +
                    "  <MarginBottom>.25 in</MarginBottom>" +
                    "</DeviceInfo>";
                Warning[] warnings;
                string[] streams;
                byte[] renderedBytes;
                //Render the report            
                renderedBytes = localReport.Render(reportType, deviceInfo, out mimeType, out encoding, out fileNameExtension, out streams, out warnings);

                //return Json(File(renderedBytes, mimeType), JsonRequestBehavior.AllowGet);
                return File(renderedBytes, mimeType);
            }
            else
            {
                return View("~/Views/Shared/NoDataFound.cshtml");
            }
        }

        [PermissionAuthorization("33")]
        public ActionResult PaymentReport(string Status)
        {

            DataSet ds = new DataSet();
            DataTable dtData = new DataTable();
            SqlDataAdapter sqlDa = new SqlDataAdapter();
            LocalReport localReport = new LocalReport();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();

            SqlCommand dCmd = new SqlCommand("SP_REPORTS", conn);
            dCmd.CommandType = CommandType.StoredProcedure;
            dCmd.Parameters.AddWithValue("@QueryOption", 4);
            dCmd.Parameters.AddWithValue("@Status", Status);

            sqlDa.SelectCommand = dCmd;
            sqlDa.Fill(ds);

            localReport.ReportPath = Server.MapPath("~/Reports/PaymentReport.rdlc");
            ReportDataSource reportDataSource = new ReportDataSource();

            reportDataSource.Name = "USP_PAYMENT";
            reportDataSource.Value = ds.Tables[0];
            if (ds.Tables[0].Rows.Count > 0)
            {
                //ReportParameter PFromDate = new ReportParameter("FromDate", FromDate);
                //ReportParameter PToDate = new ReportParameter("ToDate", ToDate);
                //ReportParameter CompanyName = new ReportParameter("CompanyName", companyName);

                //localReport.SetParameters(new ReportParameter[] { PFromDate, PToDate, CompanyName });
                localReport.Refresh();
                localReport.DataSources.Add(reportDataSource);
                string reportType = "EXCELOPENXML";
                string mimeType;
                string encoding;
                string fileNameExtension;
                //The DeviceInfo settings should be changed based on the reportType            
                //http://msdn2.microsoft.com/en-us/library/ms155397.aspx            
                string deviceInfo = "<DeviceInfo>" +
                    "  <OutputFormat>EXCEL</OutputFormat>" +
                    "  <PageWidth>11.69in</PageWidth>" +
                    "  <PageHeight>8.27in </PageHeight>" +
                    "  <MarginTop>.25 in</MarginTop>" +
                    "  <MarginLeft>.25 in</MarginLeft>" +
                    "  <MarginRight>.25 in</MarginRight>" +
                    "  <MarginBottom>.25 in</MarginBottom>" +
                    "</DeviceInfo>";
                Warning[] warnings;
                string[] streams;
                byte[] renderedBytes;
                //Render the report            
                renderedBytes = localReport.Render(reportType, deviceInfo, out mimeType, out encoding, out fileNameExtension, out streams, out warnings);

                //return Json(File(renderedBytes, mimeType), JsonRequestBehavior.AllowGet);
                return File(renderedBytes, mimeType);
            }
            else
            {
                return View("~/Views/Shared/NoDataFound.cshtml");
            }
        }
    }
}