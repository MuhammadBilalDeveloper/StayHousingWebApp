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
    public class CompanyList
    {
        public int InsertCompany(CompanyModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Company", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@Company", model.Company);
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

        public List<CompanyModel> LoadAllCompany()
        {
            List<CompanyModel> modelList = new List<CompanyModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Company", conn);
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
                                 select new CompanyModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     Company = row["Company"].ToString()
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<CompanyModel> LoadSelectedCompany(string ID)
        {
            List<CompanyModel> modelList = new List<CompanyModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Company", conn);
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
                                 select new CompanyModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     Company = row["Company"].ToString()
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int DeleteCompany(string ID)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Company", conn);
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
