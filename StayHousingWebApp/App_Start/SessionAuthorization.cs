using StayHousingCommon;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace StayHousingWebApp.App_Start
{
    public class SessionAuthorization: AuthorizeAttribute
    {
        public SessionAuthorization()
        {
        }
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (SessionVar.Email != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "action", "Index" }, { "controller", "Login" } });
        }
    }
}