using StayHousingCommon;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace StayHousingWebApp.App_Start
{
    public class PermissionAuthorization: AuthorizeAttribute
    {
        string menuid;
        public PermissionAuthorization(string roleKeys) {
            this.menuid = roleKeys;
        }
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            var menuarr = SessionVar.Menus.Split(',');
            if (menuarr.Length>0 && menuarr.Contains(menuid))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        protected override void HandleUnauthorizedRequest(AuthorizationContext context)
        {
            if (context.HttpContext.Request.IsAjaxRequest())
            {
                var urlHelper = new UrlHelper(context.RequestContext);
                context.HttpContext.Response.StatusCode = 403;
                context.Result = new JsonResult
                {
                    Data = new
                    {
                        Error = "NotAuthorized",
                        LogOnUrl = urlHelper.Action("PermissionDenied", "Dashboard")
                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            else
            {
                context.Result = new RedirectToRouteResult(new RouteValueDictionary { { "action", "PermissionDenied" }, { "controller", "Dashboard" } });
            }
        }
    }
}