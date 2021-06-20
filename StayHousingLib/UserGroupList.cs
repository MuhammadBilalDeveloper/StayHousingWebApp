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
    public class UserGroupList
    {
        public List<UserGroupModel> LoadAllUserGroup()
        {
            List<UserGroupModel> modelList = new List<UserGroupModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserGroup", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 3);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new UserGroupModel
                                 {
                                     ID =Convert.ToInt32(row["ID"].ToString()),
                                     SLNO= Convert.ToInt32(row["SLNO"].ToString()),
                                     Title =row["Title"].ToString(),
                                     isActive=Convert.ToBoolean(row["isActive"])
                                 }).ToList();

                }
                return modelList;

            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public int InsertUserGroup(UserGroupModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserGroup", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@Title", model.Title);
            dAd.Parameters.AddWithValue("@IsActive", model.isActive);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
            if (model.ID > 0)
                dAd.Parameters.AddWithValue("@QueryOption", 2);
            else
                dAd.Parameters.AddWithValue("@QueryOption", 1);

            try
            {
                return dAd.ExecuteNonQuery();
            }catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<UserGroupModel> LoadSelectedUserGroup(int ID)
        {
            List<UserGroupModel> modelList = new List<UserGroupModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserGroup", conn);
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
                                 select new UserGroupModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     SLNO = Convert.ToInt32(row["SLNO"].ToString()),
                                     Title = row["Title"].ToString(),
                                     isActive = Convert.ToBoolean(row["isActive"])
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int DeleteUserGroup(int ID)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserGroup", conn);
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

        //--------*** Menus ***---------
        public List<MenuModel> LoadAllMenus(int ID)
        {
            List<MenuModel> modelList = new List<MenuModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserGroup", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", ID);
            dAd.Parameters.AddWithValue("@QueryOption", 6);
            DataTable dt = new DataTable();
            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new MenuModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     SLNO = Convert.ToInt32(row["SLNO"].ToString()),
                                     MenuLink = row["MenuLink"].ToString(),
                                     MenuTitle = row["MenuTitle"].ToString(),
                                     ParentTitle = row["ParentTitle"].ToString(),
                                     IsActive = Convert.ToBoolean(row["IsActive"]),
                                     IsExist = Convert.ToBoolean(row["IsExist"])
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertGroupPermission(int ID, string menuIDs, int isChecked)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserGroup", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", ID);
            dAd.Parameters.AddWithValue("@menuIDs", menuIDs);
            dAd.Parameters.AddWithValue("@isChecked", isChecked);
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
    }
}
