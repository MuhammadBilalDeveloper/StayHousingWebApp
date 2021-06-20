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
    public class PaymentsList
    {
        public List<TenantModel> LoadAllTenants(TenantModel model)
        {
            List<TenantModel> modelList = new List<TenantModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_PAYMENTS", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@NI", model.NI);
            dAd.Parameters.AddWithValue("@FullName", model.FullName);
            dAd.Parameters.AddWithValue("@CRN", model.CRN);
            dAd.Parameters.AddWithValue("@DOB", model.DOB);
            dAd.Parameters.AddWithValue("@Address", model.Address);
            dAd.Parameters.AddWithValue("@Referral", model.Referral);
            dAd.Parameters.AddWithValue("@CheckInDate", model.JoiningDate);
            dAd.Parameters.AddWithValue("@LastPaymentDate", model.LastPaymentDate);
            dAd.Parameters.AddWithValue("@DateCalled", model.DateCalled);
            dAd.Parameters.AddWithValue("@Company", SessionVar.Menus.Contains("35") == true ? "0" : SessionVar.Company);
            dAd.Parameters.AddWithValue("@Status", model.Status);
            dAd.Parameters.AddWithValue("@QueryOption", 1);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new TenantModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     SLNO = Convert.ToInt32(row["SLNO"].ToString()),
                                     TenantsID = row["TenantsID"].ToString(),
                                     FirstName = row["FirstName"].ToString(),
                                     MiddleName = row["MiddleName"].ToString(),
                                     Surname = row["Surname"].ToString(),
                                     ContactNo = row["ContactNo"].ToString(),
                                     DOB = row["DOB"].ToString(),
                                     Gender = row["Gender"].ToString(),
                                     NI = row["NI"].ToString(),
                                     CRN = row["CRN"].ToString(),
                                     Issues = row["Issues"].ToString(),
                                     CriminalConviction = row["CriminalConviction"].ToString(),
                                     SupportWorker = row["SupportWorker"].ToString(),
                                     SocialWorker = row["SocialWorker"].ToString(),
                                     IsLeft = row["IsLeft"].ToString(),
                                     IsFirstTime = row["IsFirstTime"].ToString(),
                                     CheckInDate = row["CheckInDate"].ToString(),
                                     DateCalled = row["DateCalled"].ToString(),
                                     LastPaymentDate = row["LastPaymentDate"].ToString(),
                                     Status = row["Status"].ToString(),
                                     ProfileStatus = row["ProfileStatus"].ToString(),
                                     LeaversStatus = row["LeaversStatus"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Referral = row["Referral"].ToString(),
                                     AddedBy = Convert.ToInt32(row["AddedBy"].ToString()),
                                     DateAdded = row["DateAdded"].ToString(),
                                     PropertyID = row["PropertyID"].ToString(),
                                     Address = row["Address"].ToString(),
                                     RoomNo = row["RoomNo"].ToString(),

                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertPayment(PaymentsModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_PAYMENTS", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@TenantsID", model.TenantsID);
            dAd.Parameters.AddWithValue("@DateCalled", model.DateCalled);
            dAd.Parameters.AddWithValue("@Period", model.Period);
            dAd.Parameters.AddWithValue("@Amount", model.Amount);
            dAd.Parameters.AddWithValue("@TotalOwedAmount", model.TotalOwedAmount);
            dAd.Parameters.AddWithValue("@RemainingAmount", model.RemainingAmount);
            dAd.Parameters.AddWithValue("@Status", model.Status);
            dAd.Parameters.AddWithValue("@GStatus", model.GStatus);
            dAd.Parameters.AddWithValue("@Comments", model.Comments);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
            if (model.ID > 0)
                dAd.Parameters.AddWithValue("@QueryOption", 3);
            else
                dAd.Parameters.AddWithValue("@QueryOption", 2);

            try
            {
                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<PaymentsModel> LoadAllPaymentsByTenantsID(string TenantsID)
        {
            List<PaymentsModel> modelList = new List<PaymentsModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_PAYMENTS", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@TenantsID", TenantsID);
            dAd.Parameters.AddWithValue("@QueryOption", 4);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new PaymentsModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     TenantsID = row["TenantsID"].ToString(),
                                     DateCalled = row["DateCalled"].ToString(),
                                     Period = row["Period"].ToString(),
                                     TotalOwedAmount = Convert.ToDouble(row["TotalOwedAmount"].ToString()),
                                     Amount = Convert.ToDouble(row["Amount"].ToString()),
                                     RemainingAmount = Convert.ToDouble(row["RemainingAmount"].ToString()),
                                     Status = row["Status"].ToString(),
                                     Comments = row["Comments"].ToString(),

                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<PaymentsModel> LoadSelectedPayment(int ID)
        {
            List<PaymentsModel> modelList = new List<PaymentsModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_PAYMENTS", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", ID);
            dAd.Parameters.AddWithValue("@QueryOption", 5);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new PaymentsModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     TenantsID = row["TenantsID"].ToString(),
                                     DateCalled = row["DateCalled"].ToString(),
                                     Period = row["Period"].ToString(),
                                     TotalOwedAmount = Convert.ToDouble(row["TotalOwedAmount"].ToString()),
                                     Amount = Convert.ToDouble(row["Amount"].ToString()),
                                     RemainingAmount = Convert.ToDouble(row["RemainingAmount"].ToString()),
                                     Status = row["Status"].ToString(),
                                     GStatus = row["GStatus"].ToString(),
                                     Comments = row["Comments"].ToString(),

                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int DeletePayment(int ID)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_PAYMENTS", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", ID);
            dAd.Parameters.AddWithValue("@QueryOption", 6);
            try
            {
                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int ChangeTenantsStatusByPayment(TenantModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_PAYMENTS", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@TenantsID", model.TenantsID);
            dAd.Parameters.AddWithValue("@Status", model.Status);
            dAd.Parameters.AddWithValue("@CheckOutDate", model.CheckOutDate);
            dAd.Parameters.AddWithValue("@LeaversStatus", model.LeaversStatus);
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

        public int InsertPaymentVerification(PaymentsModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_PAYMENTS", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@Amount", model.Amount);
            dAd.Parameters.AddWithValue("@RemainingAmount", model.RemainingAmount);
            dAd.Parameters.AddWithValue("@Status", model.Status);
            dAd.Parameters.AddWithValue("@AddedBy",SessionVar.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 8);

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
