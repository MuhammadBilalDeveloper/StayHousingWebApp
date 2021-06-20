using StayHousingCommon;
using StayHousingModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Linq;

namespace StayHousingLib
{
    public class HolidayList
    {
        public List<HolidayModel> LoadAllHoliday(string GroupID,string GroupTitle)
        {
            List<HolidayModel> modelList = new List<HolidayModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserHoliday", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 3);
            if(!string.IsNullOrEmpty(GroupTitle) && (GroupTitle.ToLower().Trim()!= "admin" && GroupTitle.ToLower().Trim() != "manager"))
            dAd.Parameters.AddWithValue("@UserAccountID", GroupID);
            dAd.Parameters.AddWithValue("@AccountID", GroupID);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new HolidayModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     SLNO = Convert.ToInt32(row["SLNO"].ToString()),
                                     HolidayDate = Convert.ToDateTime(row["HolidayDate"].ToString()),
                                     HolidayEndDate = Convert.ToDateTime(row["HolidayEndDate"].ToString()),
                                     HolidayType = Convert.ToString(row["HolidayType"]),
                                     Reason = Convert.ToString(row["Reason"]),
                                     FullName = Convert.ToString(row["FullName"]),
                                     UserAccountID = Convert.ToInt32(row["UserAccountID"]),
                                     IsActive = Convert.ToBoolean(row["IsActive"]),
                                     IsApproved = Convert.ToBoolean(row["IsApproved"]),
                                     Approved = Convert.ToString(row["Approved"]),
                                     Leaves = Convert.ToString(row["Leaves"]),
                                     AvailLeaves = Convert.ToString(row["AvailLeaves"]),
                                     Days = Convert.ToString(row["Days"]),
                                     PermissionBy= Convert.ToString(row["PermissionBy"]),
                                     ApprovedBy = Convert.ToString(row["ApprovedBy"])
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<HolidayModel> LoadHolidayCount(string GroupID, string GroupTitle)
        {
            List<HolidayModel> modelList = new List<HolidayModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserHoliday", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 8);
            dAd.Parameters.AddWithValue("@AccountID", GroupID);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new HolidayModel
                                 {
                                     Leaves = Convert.ToString(row["Leaves"]),
                                     AvailLeaves = Convert.ToString(row["AvailLeaves"])
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertHoliday(HolidayModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserHoliday", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            if(model.HolidayDate > DateTime.MinValue)
            dAd.Parameters.AddWithValue("@HolidayDate", model.HolidayDate);
            if (model.HolidayEndDate > DateTime.MinValue)
                dAd.Parameters.AddWithValue("@HolidayEndDate", model.HolidayEndDate);
            dAd.Parameters.AddWithValue("@HolidayType", model.HolidayType);
            dAd.Parameters.AddWithValue("@UserAccountID", model.UserAccountID);
            dAd.Parameters.AddWithValue("@Reason", model.Reason);
            dAd.Parameters.AddWithValue("@IsApproved", model.IsApproved);
            dAd.Parameters.AddWithValue("@Days", model.Days);
            if (model.ID > 0 && model.IsApproved)
                dAd.Parameters.AddWithValue("@QueryOption", 6);
            else if (model.ID > 0)
                dAd.Parameters.AddWithValue("@QueryOption", 2);
            else
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
        public int InsertApproveHoliday(HolidayModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserHoliday", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            if (model.ApprovalDate > DateTime.MinValue)
                dAd.Parameters.AddWithValue("@ApprovalDate", model.ApprovalDate);
            if (model.PermissionDate > DateTime.MinValue)
                dAd.Parameters.AddWithValue("@PermissionDate", model.PermissionDate);
            dAd.Parameters.AddWithValue("@PermissionBy", model.PermissionBy);
            dAd.Parameters.AddWithValue("@Permission", model.Permission);
            dAd.Parameters.AddWithValue("@IsApproved", model.IsApproved);
            dAd.Parameters.AddWithValue("@ApprovedBy", model.ApprovedBy);
            if (model.ID > 0)
                dAd.Parameters.AddWithValue("@QueryOption", 7);

            try
            {
                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<HolidayModel> LoadSelectedHoliday(int ID)
        {
            List<HolidayModel> modelList = new List<HolidayModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserHoliday", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 4);
            dAd.Parameters.AddWithValue("@ID", ID);
            DataTable dt = new DataTable();
            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new HolidayModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     SLNO = Convert.ToInt32(row["SLNO"].ToString()),
                                     HolidayDate = Convert.ToDateTime(row["HolidayDate"].ToString()),
                                     HolidayEndDate = Convert.ToDateTime(row["HolidayEndDate"].ToString()),
                                     HolidayType = Convert.ToString(row["HolidayType"]),
                                     Reason = Convert.ToString(row["Reason"]),
                                     FullName = Convert.ToString(row["FullName"]),
                                     UserAccountID = Convert.ToInt32(row["UserAccountID"]),
                                     IsActive = Convert.ToBoolean(row["IsActive"]),
                                     IsApproved = Convert.ToBoolean(row["IsApproved"]),
                                     Approved = Convert.ToString(row["Approved"]),
                                     Days = Convert.ToString(row["Days"])
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int DeleteHoliday(int ID)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserHoliday", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", ID);
            dAd.Parameters.AddWithValue("@QueryOption", 5);

            try
            {
                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        
    }
}
