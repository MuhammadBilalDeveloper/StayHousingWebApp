using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StayHousingCommon
{
    public static class AppSettings
    {
        public static string Version { get; private set; }
        static AppSettings()

        {
            Version = ConfigurationManager.AppSettings["Version"];
        }
    }
}
