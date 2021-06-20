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
    public class UserAccountList
    {
        public List<UserAccountModel> LoadAllUserAccounts()
        {
            Encryption objEncrypt = new Encryption();

            List<UserAccountModel> modelList = new List<UserAccountModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserAccounts", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@Company", SessionVar.Menus.Contains("35") == true ? "0" : SessionVar.Company);
            dAd.Parameters.AddWithValue("@QueryOption", 3);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new UserAccountModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     SLNO = Convert.ToInt32(row["SLNO"].ToString()),
                                     EmployeeCode = row["EmployeeCode"].ToString(),
                                     Email = row["Email"].ToString(),
                                     Phone = row["Phone"].ToString(),
                                     Password = objEncrypt.EncryptWord(row["Password"].ToString()),
                                     FirstName = row["FirstName"].ToString(),
                                     MiddleName = row["MiddleName"].ToString(),
                                     SurName = row["SurName"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Gender = row["Gender"].ToString(),
                                     DOB = row["DOB"].ToString(),
                                     GroupID = Convert.ToInt32(row["GroupID"].ToString()),
                                     GroupTitle = row["GroupTitle"].ToString(),
                                     IsActive = Convert.ToBoolean(row["IsActive"].ToString()),
                                     LastLogged = row["LastLogged"].ToString(),
                                     Company = row["Company"].ToString(),
                                     CompanyName = row["CompanyName"].ToString(),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<UserAccountModel> LoadSelectedUserAccount(int ID)
        {
            Encryption objEncrypt = new Encryption();

            List<UserAccountModel> modelList = new List<UserAccountModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserAccounts", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", ID);
            dAd.Parameters.AddWithValue("@QueryOption", 4);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new UserAccountModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     SLNO = Convert.ToInt32(row["SLNO"].ToString()),
                                     EmployeeCode = row["EmployeeCode"].ToString(),
                                     Email = row["Email"].ToString(),
                                     Phone = row["Phone"].ToString(),
                                     Password = objEncrypt.DecryptWord(row["Password"].ToString()),
                                     FirstName = row["FirstName"].ToString(),
                                     MiddleName = row["MiddleName"].ToString(),
                                     SurName = row["SurName"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Gender = row["Gender"].ToString(),
                                     DOB = row["DOB"].ToString(),
                                     GroupID = Convert.ToInt32(row["GroupID"].ToString()),
                                     GroupTitle = row["GroupTitle"].ToString(),
                                     IsActive = Convert.ToBoolean(row["IsActive"].ToString()),
                                     LastLogged = row["LastLogged"].ToString(),
                                     Company = row["Company"].ToString(),
                                     HolidayStartDate = Convert.ToString(row["HolidayStartDate"]),
                                     HolidayEntitlement = row["HolidayEntitlement"]!= DBNull.Value ? (decimal?)row["HolidayEntitlement"]:null,
                                     HoursWorked = row["HoursWorked"] != DBNull.Value ? (decimal?)row["HoursWorked"] : null,
                                     Daysworked = row["Daysworked"] != DBNull.Value ? (decimal?)row["Daysworked"] : null,
                                     ContractType = Convert.ToString(row["ContractType"])
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertUserAccount(UserAccountModel model)
        {
            Encryption objEncrypt = new Encryption();
            string EncryptedPass = objEncrypt.EncryptWord(model.Password);

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserAccounts", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@EmployeeCode", model.EmployeeCode);
            dAd.Parameters.AddWithValue("@Email", model.Email);
            dAd.Parameters.AddWithValue("@Phone", model.Phone);
            dAd.Parameters.AddWithValue("@Password", EncryptedPass);
            dAd.Parameters.AddWithValue("@FirstName", model.FirstName);
            dAd.Parameters.AddWithValue("@MiddleName", model.MiddleName);
            dAd.Parameters.AddWithValue("@SurName", model.SurName);
            dAd.Parameters.AddWithValue("@ImagePath", model.ImagePath);
            dAd.Parameters.AddWithValue("@Gender", model.Gender);
            dAd.Parameters.AddWithValue("@DOB", model.DOB);
            dAd.Parameters.AddWithValue("@GroupID", model.GroupID);
            dAd.Parameters.AddWithValue("@Company", model.Company);
            dAd.Parameters.AddWithValue("@IsActive", model.IsActive);
            dAd.Parameters.AddWithValue("@AddedBy", SessionVar.ID);
            dAd.Parameters.AddWithValue("@HolidayStartDate", model.HolidayStartDate);
            dAd.Parameters.AddWithValue("@HolidayEntitlement", model.HolidayEntitlement);
            dAd.Parameters.AddWithValue("@HoursWorked", model.HoursWorked);
            dAd.Parameters.AddWithValue("@Daysworked", model.Daysworked);
            dAd.Parameters.AddWithValue("@ContractType", model.ContractType);
            if (model.ID > 0)
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

        public int DeleteUserAccount(int ID)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserAccounts", conn);
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

        public List<UserGroupModel> LoadAllUserGroup()
        {
            List<UserGroupModel> modelList = new List<UserGroupModel>();
            List<CompanyModel> CompanyModelList = new List<CompanyModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserAccounts", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 6);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Tables[0].Rows
                                 select new UserGroupModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     Title = row["Title"].ToString()
                                 }).ToList();

                    CompanyModelList= (from DataRow row in dt.Tables[1].Rows
                                       select new CompanyModel
                                       {
                                           ID = Convert.ToInt32(row["ID"].ToString()),
                                           Company = row["Company"].ToString()
                                       }).ToList();

                    modelList[0].CompanyModelList = CompanyModelList;
                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<UserAccountModel> GetLoginInfo(UserAccountModel model)
        {
            Encryption objEncrypt = new Encryption();
            string EncryptedPass = objEncrypt.EncryptWord(model.Password);

            List<UserAccountModel> modelList = new List<UserAccountModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserAccounts", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@Email", model.Email);
            dAd.Parameters.AddWithValue("@Password", EncryptedPass);
            dAd.Parameters.AddWithValue("@QueryOption", 8);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new UserAccountModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     EmployeeCode = row["EmployeeCode"].ToString(),
                                     Email = row["Email"].ToString(),
                                     Phone = row["Phone"].ToString(),
                                     Password = objEncrypt.DecryptWord(row["Password"].ToString()),
                                     FirstName = row["FirstName"].ToString(),
                                     MiddleName = row["MiddleName"].ToString(),
                                     SurName = row["SurName"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Gender = row["Gender"].ToString(),
                                     DOB = row["DOB"].ToString(),
                                     GroupID = Convert.ToInt32(row["GroupID"].ToString()),
                                     GroupTitle = row["GroupTitle"].ToString(),
                                     Menus = row["MENUS"].ToString(),
                                     Company = row["Company"].ToString(),
                                     CompanyName = row["CompanyName"].ToString(),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //***** MyAccount - Basic Information Update ******* ///
        public int UpdateBasicInformation(UserAccountModel model)
        {
            Encryption objEncrypt = new Encryption();
            string EncryptedPass = objEncrypt.EncryptWord(model.Password);

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_UserAccounts", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", SessionVar.ID);
            dAd.Parameters.AddWithValue("@Email", model.Email);
            dAd.Parameters.AddWithValue("@Phone", model.Phone);
            dAd.Parameters.AddWithValue("@Password", EncryptedPass);
            dAd.Parameters.AddWithValue("@FirstName", model.FirstName);
            dAd.Parameters.AddWithValue("@MiddleName", model.MiddleName);
            dAd.Parameters.AddWithValue("@SurName", model.SurName);
            dAd.Parameters.AddWithValue("@ImagePath", model.ImagePath);
            dAd.Parameters.AddWithValue("@DOB", model.DOB);
            dAd.Parameters.AddWithValue("@Company", model.Company);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
            dAd.Parameters.AddWithValue("@QueryOption", 9);

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
