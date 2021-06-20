using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

namespace StayHousingCommon
{
    public static class SessionVar
    {
        public static string ID
        {
            get{return HttpContext.Current.Session["ID"] as string;}
            set{ HttpContext.Current.Session["ID"] = value;}
        }
        public static string UserID
        {
            get { return HttpContext.Current.Session["UserID"] as string; }
            set { HttpContext.Current.Session["UserID"] = value; }
        }
        public static string Email
        {
            get { return HttpContext.Current.Session["Email"] as string; }
            set { HttpContext.Current.Session["Email"] = value; }
        }
        public static string FirstName
        {
            get { return HttpContext.Current.Session["FirstName"] as string; }
            set { HttpContext.Current.Session["FirstName"] = value; }
        }
        public static string MiddleName
        {
            get { return HttpContext.Current.Session["MiddleName"] as string; }
            set { HttpContext.Current.Session["MiddleName"] = value; }
        }
        public static string Surname
        {
            get { return HttpContext.Current.Session["Surname"] as string; }
            set { HttpContext.Current.Session["Surname"] = value; }
        }
        public static string Phone
        {
            get { return HttpContext.Current.Session["Phone"] as string; }
            set { HttpContext.Current.Session["Phone"] = value; }
        }
        public static string ImagePath
        {
            get { return HttpContext.Current.Session["ImagePath"] as string; }
            set { HttpContext.Current.Session["ImagePath"] = value; }
        }
        public static string GroupID
        {
            get { return HttpContext.Current.Session["GroupID"] as string; }
            set { HttpContext.Current.Session["GroupID"] = value; }
        }
        public static string GroupTitle
        {
            get { return HttpContext.Current.Session["GroupTitle"] as string; }
            set { HttpContext.Current.Session["GroupTitle"] = value; }
        }
        public static string DOB
        {
            get { return HttpContext.Current.Session["DOB"] as string; }
            set { HttpContext.Current.Session["DOB"] = value; }
        }
        public static string Gender
        {
            get { return HttpContext.Current.Session["Gender"] as string; }
            set { HttpContext.Current.Session["Gender"] = value; }
        }
        public static string Menus
        {
            get { return HttpContext.Current.Session["Menus"] as string; }
            set { HttpContext.Current.Session["Menus"] = value; }
        }
        public static string Company
        {
            get { return HttpContext.Current.Session["Company"] as string; }
            set { HttpContext.Current.Session["Company"] = value; }
        }
        public static string CompanyName
        {
            get { return HttpContext.Current.Session["CompanyName"] as string; }
            set { HttpContext.Current.Session["CompanyName"] = value; }
        }
    }
}
