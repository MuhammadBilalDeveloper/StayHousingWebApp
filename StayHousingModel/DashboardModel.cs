using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StayHousingModel
{
    public class DashboardModel
    {
        public int TotalUsers { get; set; }
        public int TotalTenants { get; set; }
        public int TotalActiveTenants { get; set; }
        public int TotalClearedTenants { get; set; }
        public int TotalOutstandingTenants { get; set; }
        public int TotalProperties { get; set; }
        public int TotalRooms { get; set; }
        public int TotalOccupiedRooms { get; set; }
        public int TotalEmptyRooms { get; set; }

        public List<MonthWiseAmountModel> MonthWiseAmountLIst { get; set; }
        public List<ExpiryCertificateModel> ExpiryCertificateModelList { get; set; }
    }

    public class MonthWiseAmountModel
    {
        public string MonthName { get; set; }
        public double Amount { get; set; }
    }

    public class ExpiryCertificateModel
    {
        public string PropertyID { get; set; }
        public string Address { get; set; }
        public string ExpairyDate { get; set; }
        public string CertificateType { get; set; }
        public string FilePath { get; set; }
    }
    public class DBbackupModel
    {
        public int ID { get; set; }
        public string FilePath { get; set; }
        public string BackupTakenBy { get; set; }
        public string BackupDate { get; set; }
    }
}
