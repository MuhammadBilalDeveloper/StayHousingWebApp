using StayHousingCommon;
using StayHousingModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StayHousingLib
{
    public class DashboardList
    {
        public List<DashboardModel> LoadAllInitialData()
        {
            List<DashboardModel> modelList = new List<DashboardModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Dashboard", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@Company", SessionVar.Menus.Contains("35")==true?"0":SessionVar.Company);
            dAd.Parameters.AddWithValue("@QueryOption", 1);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Tables[0].Rows
                                 select new DashboardModel
                                 {
                                     TotalUsers = Convert.ToInt32(row["TotalUsers"].ToString()),
                                     TotalTenants = Convert.ToInt32(row["TotalTenants"].ToString()),
                                     TotalActiveTenants = Convert.ToInt32(row["TotalActiveTenants"].ToString()),
                                     TotalClearedTenants = Convert.ToInt32(row["TotalClearedTenants"].ToString()),
                                     TotalOutstandingTenants = Convert.ToInt32(row["TotalOutstandingTenants"].ToString()),
                                     TotalProperties = Convert.ToInt32(row["TotalProperties"].ToString()),
                                     TotalRooms = Convert.ToInt32(row["TotalRooms"].ToString()),
                                     TotalOccupiedRooms = Convert.ToInt32(row["TotalOccupiedRooms"].ToString()),
                                     TotalEmptyRooms = Convert.ToInt32(row["TotalEmptyRooms"].ToString()),

                                     MonthWiseAmountLIst = (from DataRow row1 in dt.Tables[1].Rows
                                                            select new MonthWiseAmountModel
                                                            {
                                                                MonthName=row1["MonthName"].ToString(),
                                                                Amount=Convert.ToDouble(row1["Amount"].ToString()),
                                                            }).ToList()
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<ExpiryCertificateModel> LoadExpiryCertificateNotificationData()
        {
            List<ExpiryCertificateModel> modelList = new List<ExpiryCertificateModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Dashboard", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 2);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row2 in dt.Tables[0].Rows
                                 select new ExpiryCertificateModel
                                 {
                                     PropertyID = row2["PropertyID"].ToString(),
                                     Address = row2["Address"].ToString(),
                                     ExpairyDate = row2["ExpairyDate"].ToString(),
                                     CertificateType = row2["CertificateType"].ToString(),
                                     FilePath = row2["FilePath"].ToString(),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertDBBackup()
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_BACKUP", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 1);

            try
            {
                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DBbackupModel> LoadLatestBDBak()
        {
            List<DBbackupModel> modelList = new List<DBbackupModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_BACKUP", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 2);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row2 in dt.Tables[0].Rows
                                 select new DBbackupModel
                                 {
                                     ID = Convert.ToInt32(row2["ID"].ToString()),
                                     FilePath = row2["FilePath"].ToString(),
                                     BackupTakenBy = row2["BackupTakenBy"].ToString(),
                                     BackupDate = row2["BackupDate"].ToString()
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertFileBackup()
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_BACKUP", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 3);

            try
            {
                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<DBbackupModel> LoadFileBackUp()
        {
            List<DBbackupModel> modelList = new List<DBbackupModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_BACKUP", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 4);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row2 in dt.Tables[0].Rows
                                 select new DBbackupModel
                                 {
                                     ID = Convert.ToInt32(row2["ID"].ToString()),
                                     FilePath = row2["FilePath"].ToString(),
                                     BackupTakenBy = row2["BackupTakenBy"].ToString(),
                                     BackupDate = row2["BackupDate"].ToString()
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
