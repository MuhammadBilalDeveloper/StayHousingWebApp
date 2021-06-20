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
    public class TenantsList
    {
        public List<PropertyModel> LoadAllProperty()
        {
            List<PropertyModel> modelList = new List<PropertyModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 2);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new PropertyModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     SLNO = Convert.ToInt32(row["SLNO"].ToString()),
                                     PropertyID = row["PropertyID"].ToString(),
                                     PropertyTypeID = Convert.ToInt32(row["PropertyTypeID"].ToString()),
                                     PropertyType = row["PropertyType"].ToString(),
                                     Address = row["Address"].ToString(),
                                     Area = row["Area"].ToString(),
                                     Postcode = row["Postcode"].ToString(),
                                     NumberOfRooms = row["NumberOfRooms"].ToString(),
                                     SupportWorker = row["SupportWorker"].ToString(),
                                     CouncilActiveDate = row["CouncilActiveDate"].ToString(),
                                     HouseCameFrom = row["HouseCameFrom"].ToString(),
                                     LeaseDuration = row["LeaseDuration"].ToString(),
                                     LandlordName = row["LandlordName"].ToString(),
                                     LandlordContactNo = row["LandlordContactNo"].ToString(),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<PropertyRoomModel> LoadRoomsByAddress(string PropertyID)
        {
            List<PropertyRoomModel> modelList = new List<PropertyRoomModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@PropertyID", PropertyID);
            dAd.Parameters.AddWithValue("@QueryOption", 3);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new PropertyRoomModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     PropertyID = row["PropertyID"].ToString(),
                                     RoomNo = row["RoomNo"].ToString(),
                                     FullName = row["FullName"].ToString(),
                                     TenantsID = row["TenantsID"].ToString(),
                                     EntryDate = row["EntryDate"].ToString(),
                                     IsOccupied = Convert.ToInt32(row["IsOccupied"].ToString()),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertTenant(TenantModel model)
        {
            DataTable ContactsDt = new DataTable();
            DataTable DocsDt = new DataTable();
            DataTable ConvictionsDT = new DataTable();
            DataTable IssuesDT = new DataTable();
            DataTable SupportWorkersDt = new DataTable();
            
            ContactsDt = GetContactsDatatable(model.TenantsContactsList);
            ConvictionsDT = GetCriminaConvictionsDatatable(model.CriminalConvictionsList);
            IssuesDT = GetIssuesDatabale(model.TenantsIssuesList);
            DocsDt = GetDocumentsDatatable(model.TenantsDocumentsList);
            SupportWorkersDt = GetSupporWorkerDatatable(model.SupportWorkerList);



            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@FirstName", model.FirstName);
            dAd.Parameters.AddWithValue("@MiddleName", model.MiddleName);
            dAd.Parameters.AddWithValue("@Surname", model.Surname);
            dAd.Parameters.AddWithValue("@ContactNo", model.ContactNo);
            dAd.Parameters.AddWithValue("@DOB", model.DOB);
            dAd.Parameters.AddWithValue("@Gender", model.Gender);
            dAd.Parameters.AddWithValue("@NI", model.NI);
            dAd.Parameters.AddWithValue("@CRN", model.CRN);
            dAd.Parameters.AddWithValue("@Issues", model.Issues);
            dAd.Parameters.AddWithValue("@CriminalConviction", model.CriminalConviction);
            dAd.Parameters.AddWithValue("@SupportWorker", model.SupportWorker);
            dAd.Parameters.AddWithValue("@SocialWorker", model.SocialWorker);
            dAd.Parameters.AddWithValue("@IsLeft", model.IsLeft);
            dAd.Parameters.AddWithValue("@CheckoutDate", model.CheckOutDate);
            dAd.Parameters.AddWithValue("@IsFirstTime", model.IsFirstTime);
            dAd.Parameters.AddWithValue("@CheckInDate", model.CheckInDate);
            dAd.Parameters.AddWithValue("@ProfileStatus", model.ProfileStatus);
            dAd.Parameters.AddWithValue("@Status", model.Status);
            dAd.Parameters.AddWithValue("@LeaversStatus", model.LeaversStatus);
            dAd.Parameters.AddWithValue("@ImagePath", model.ImagePath);
            dAd.Parameters.AddWithValue("@Referral", model.Referral);
            dAd.Parameters.AddWithValue("@Address", model.Address);
            dAd.Parameters.AddWithValue("@RoomNo", model.RoomNo);
            dAd.Parameters.AddWithValue("@ContactsDt", ContactsDt);
            dAd.Parameters.AddWithValue("@ConvictionsDT", ConvictionsDT);
            dAd.Parameters.AddWithValue("@IssuesDT", IssuesDT);
            dAd.Parameters.AddWithValue("@DocsDt", DocsDt);
            dAd.Parameters.AddWithValue("@SupportWorkersDt", SupportWorkersDt);

            dAd.Parameters.AddWithValue("@AddedBy", 1);
            if(model.ID>0)
                dAd.Parameters.AddWithValue("@QueryOption", 9);
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

        private DataTable GetContactsDatatable(List<Contacts> list)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[3] {
                    new DataColumn("ID", typeof(string)),
                    new DataColumn("number", typeof(string)),
                    new DataColumn("label", typeof(string))
            });
            foreach (var dbModel in list)
            {
                int ID = dbModel.ID;
                string number = dbModel.number;
                string label = dbModel.label;
                dt.Rows.Add(ID, number, label);
            }
            if (list.Count == 0)
            {
                dt.Rows.Add(0, "", "");
            }
            return dt;
        }


        private DataTable GetCriminaConvictionsDatatable(List<CriminalConvictions> list)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[3] {
                    new DataColumn("ID", typeof(string)),
                    new DataColumn("CriminalConviction", typeof(string)),
                    new DataColumn("ConvictionDate", typeof(string))
            });
            foreach (var dbModel in list)
            {
                int ID = dbModel.ID;
                string CriminalConviction = dbModel.CriminalConviction;
                string ConvictionDate = dbModel.ConvictionDate;
                dt.Rows.Add(ID, CriminalConviction, ConvictionDate);
            }
            if (list.Count == 0)
            {
                dt.Rows.Add(0, "Jan 01 1900", "Jan 01 1900");
            }
            return dt;
        }

        private DataTable GetIssuesDatabale(List<Issues> list)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[2] {
                    new DataColumn("ID", typeof(string)),
                    new DataColumn("Issue", typeof(string))
            });
            foreach (var dbModel in list)
            {
                int ID = dbModel.ID;
                string Issue = dbModel.Issue;
                dt.Rows.Add(ID, Issue);
            }
            if (list.Count == 0)
            {
                dt.Rows.Add(0, "");
            }
            return dt;
        }

        private DataTable GetDocumentsDatatable(List<TenantsDocuments> list)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[2] {
                    new DataColumn("ID", typeof(string)),
                    new DataColumn("FilePath", typeof(string))
            });
            if (list != null)
            {

                foreach (var dbModel in list)
                {
                    int ID = dbModel.ID;
                    string FilePath = dbModel.FilePath;
                    dt.Rows.Add(ID, FilePath);
                }
            }
            if (list == null)
            {
                dt.Rows.Add(0, "");
            }
            return dt;
        }

        private DataTable GetSupporWorkerDatatable(List<SupportWorkersModel> list)
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[6]{
                    new DataColumn("ID", typeof(string)),
                    new DataColumn("SupportWorker", typeof(string)),
                    new DataColumn("Name", typeof(string)),
                    new DataColumn("MobileNumber", typeof(string)),
                    new DataColumn("TelephoneNumber", typeof(string)),
                    new DataColumn("Email", typeof(string))
            });
            foreach (var dbModel in list)
            {
                int ID = dbModel.ID;
                string SupportWorker = dbModel.SupportWorker;
                string Name = dbModel.Name;
                string MobileNumber = dbModel.MobileNumber;
                string TelephoneNumber = dbModel.TelephoneNumber;
                string Email = dbModel.Email;
                dt.Rows.Add(ID, SupportWorker, Name,MobileNumber,TelephoneNumber,Email);
            }
            if (list.Count==0)
            {
                dt.Rows.Add(0, "", "", "", "", "");
            }
            return dt;
        }




        public List<TenantModel> LoadAllTenants()
        {
            List<TenantModel> modelList = new List<TenantModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@Company", SessionVar.Menus.Contains("35") == true ? "0" : SessionVar.Company);
            dAd.Parameters.AddWithValue("@QueryOption", 4);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Tables[0].Rows
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
                                     FirstCheckin = row["FirstCheckin"].ToString(),
                                     LastPaymentDate = row["LastPaymentDate"].ToString(),
                                     ProfileStatus = row["ProfileStatus"].ToString(),
                                     Status = row["Status"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Referral = row["Referral"].ToString(),
                                     AddedBy = Convert.ToInt32(row["AddedBy"].ToString()),
                                     DateAdded = row["DateAdded"].ToString(),
                                     PropertyID = row["PropertyID"].ToString(),
                                     Address = row["Address"].ToString(),
                                     RoomNo = row["RoomNo"].ToString()


                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<TenantModel> FilterTenants(TenantModel model)
        {
            List<TenantModel> modelList = new List<TenantModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@NI", model.NI);
            dAd.Parameters.AddWithValue("@FullName", model.FullName);
            dAd.Parameters.AddWithValue("@CRN", model.CRN);
            dAd.Parameters.AddWithValue("@DOB", model.DOB);
            dAd.Parameters.AddWithValue("@Address", model.Address);
            dAd.Parameters.AddWithValue("@Referral", model.Referral);
            dAd.Parameters.AddWithValue("@CheckInDate", model.JoiningDate);
            dAd.Parameters.AddWithValue("@Company", SessionVar.Menus.Contains("35") == true ? "0" : SessionVar.Company);
            dAd.Parameters.AddWithValue("@QueryOption", 14);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Tables[0].Rows
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
                                     FirstCheckin = row["FirstCheckin"].ToString(),
                                     LastPaymentDate = row["LastPaymentDate"].ToString(),
                                     ProfileStatus = row["ProfileStatus"].ToString(),
                                     Status = row["Status"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Referral = row["Referral"].ToString(),
                                     AddedBy = Convert.ToInt32(row["AddedBy"].ToString()),
                                     DateAdded = row["DateAdded"].ToString(),
                                     PropertyID = row["PropertyID"].ToString(),
                                     Address = row["Address"].ToString(),
                                     RoomNo = row["RoomNo"].ToString()


                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<TenantModel> LoadSelectedTenant(TenantModel model)
        {
            List<TenantModel> modelList = new List<TenantModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 10);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Tables[0].Rows
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
                                     FirstCheckin = row["FirstCheckin"].ToString(),
                                     CheckOutDate = row["CheckOutDate"].ToString(),
                                     ProfileStatus = row["ProfileStatus"].ToString(),
                                     Status = row["Status"].ToString(),
                                     LeaversStatus = row["LeaversStatus"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Referral = row["Referral"].ToString(),
                                     AddedBy = Convert.ToInt32(row["AddedBy"].ToString()),
                                     DateAdded = row["DateAdded"].ToString(),
                                     PropertyID = row["PropertyID"].ToString(),
                                     Address = row["Address"].ToString(),
                                     RoomNo = row["RoomNo"].ToString(),
                                     TenantsContactsList = (from DataRow row1 in dt.Tables[1].Rows
                                                            select new Contacts
                                                            {
                                                                ID = Convert.ToInt32(row1["ID"].ToString()),
                                                                number = row1["number"].ToString(),
                                                                label = row1["label"].ToString(),
                                                            }).ToList(),
                                     CriminalConvictionsList = (from DataRow row2 in dt.Tables[2].Rows
                                                                select new CriminalConvictions
                                                                {
                                                                    ID = Convert.ToInt32(row2["ID"].ToString()),
                                                                    CriminalConviction = row2["CriminalConviction"].ToString(),
                                                                    ConvictionDate = row2["ConvictionDate"].ToString(),
                                                                }).ToList(),
                                     TenantsIssuesList = (from DataRow row3 in dt.Tables[3].Rows
                                                          select new Issues
                                                          {
                                                              ID = Convert.ToInt32(row3["ID"].ToString()),
                                                              Issue = row3["Issue"].ToString(),
                                                          }).ToList(),
                                     SupportWorkerList = (from DataRow row4 in dt.Tables[4].Rows
                                                          select new SupportWorkersModel
                                                          {
                                                              ID = Convert.ToInt32(row4["ID"].ToString()),
                                                              SupportWorker = row4["SupportWorker"].ToString(),
                                                              Name = row4["Name"].ToString(),
                                                              MobileNumber = row4["MobileNumber"].ToString(),
                                                              TelephoneNumber = row4["TelephoneNumber"].ToString(),
                                                              Email = row4["Email"].ToString(),
                                                          }).ToList(),
                                     TenantsDocumentsList = (from DataRow row5 in dt.Tables[5].Rows
                                                             select new TenantsDocuments
                                                             {
                                                                 ID = Convert.ToInt32(row5["ID"].ToString()),
                                                                 FilePath = row5["FilePath"].ToString(),
                                                             }).ToList(),

                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<TenantModel> LoadTenantByNI(TenantModel model)
        {
            List<TenantModel> modelList = new List<TenantModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@NI", model.NI);
            dAd.Parameters.AddWithValue("@QueryOption", 13);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Tables[0].Rows
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
                                     CheckOutDate = row["CheckOutDate"].ToString(),
                                     ProfileStatus = row["ProfileStatus"].ToString(),
                                     Status = row["Status"].ToString(),
                                     LeaversStatus = row["LeaversStatus"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Referral = row["Referral"].ToString(),
                                     AddedBy = Convert.ToInt32(row["AddedBy"].ToString()),
                                     DateAdded = row["DateAdded"].ToString(),
                                     PropertyID = row["PropertyID"].ToString(),
                                     Address = row["Address"].ToString(),
                                     RoomNo = row["RoomNo"].ToString(),
                                     TenantsContactsList = (from DataRow row1 in dt.Tables[1].Rows
                                                            select new Contacts
                                                            {
                                                                ID = Convert.ToInt32(row1["ID"].ToString()),
                                                                number = row1["number"].ToString(),
                                                                label = row1["label"].ToString(),
                                                            }).ToList(),
                                     CriminalConvictionsList = (from DataRow row2 in dt.Tables[2].Rows
                                                                select new CriminalConvictions
                                                                {
                                                                    ID = Convert.ToInt32(row2["ID"].ToString()),
                                                                    CriminalConviction = row2["CriminalConviction"].ToString(),
                                                                    ConvictionDate = row2["ConvictionDate"].ToString(),
                                                                }).ToList(),
                                     TenantsIssuesList = (from DataRow row3 in dt.Tables[3].Rows
                                                          select new Issues
                                                          {
                                                              ID = Convert.ToInt32(row3["ID"].ToString()),
                                                              Issue = row3["Issue"].ToString(),
                                                          }).ToList(),
                                     SupportWorkerList = (from DataRow row4 in dt.Tables[4].Rows
                                                          select new SupportWorkersModel
                                                          {
                                                              ID = Convert.ToInt32(row4["ID"].ToString()),
                                                              SupportWorker = row4["SupportWorker"].ToString(),
                                                              Name = row4["Name"].ToString(),
                                                              MobileNumber = row4["MobileNumber"].ToString(),
                                                              TelephoneNumber = row4["TelephoneNumber"].ToString(),
                                                              Email = row4["Email"].ToString(),
                                                          }).ToList(),
                                     TenantsDocumentsList = (from DataRow row5 in dt.Tables[5].Rows
                                                             select new TenantsDocuments
                                                             {
                                                                 ID = Convert.ToInt32(row5["ID"].ToString()),
                                                                 FilePath = row5["FilePath"].ToString(),
                                                             }).ToList(),

                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public int ChangeTenantAddress(PropertyRoomModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@PropertyID", model.PropertyID);
            dAd.Parameters.AddWithValue("@TenantsID", model.TenantsID);
            dAd.Parameters.AddWithValue("@Address", model.Address);
            dAd.Parameters.AddWithValue("@RoomNo", model.RoomNo);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
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

        public int MoveToLeavers(TenantModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@TenantsID", model.TenantsID);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
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

        public List<PropertyRoomModel> LoadPreviousAddressByTenantsID(TenantModel model)
        {
            List<PropertyRoomModel> modelList = new List<PropertyRoomModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@TenantsID", model.TenantsID);
            dAd.Parameters.AddWithValue("@QueryOption", 7);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new PropertyRoomModel
                                 {
                                     Address = row["Address"].ToString(),
                                     RoomNo = row["RoomNo"].ToString(),
                                     EntryDate= row["EntryDate"].ToString(),
                                     LeaveDate = row["LeaveDate"].ToString(),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int ChangeTenantsStatus(TenantModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@TenantsID", model.TenantsID);
            dAd.Parameters.AddWithValue("@Status", model.Status);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
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

        public int DeleteTenant(TenantModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@TenantsID", model.TenantsID);
            dAd.Parameters.AddWithValue("@QueryOption", 11);

            try
            {
                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<TenantModel> LoadTenantsDetails(TenantModel model)
        {
            List<TenantModel> modelList = new List<TenantModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Tenants", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 12);
            DataSet dt = new DataSet();

            try
            {
                sda.Fill(dt);

                if (dt.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Tables[0].Rows
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
                                     FirstCheckin = row["FirstCheckin"].ToString(),
                                     ProfileStatus = row["ProfileStatus"].ToString(),
                                     Status = row["Status"].ToString(),
                                     ImagePath = row["ImagePath"].ToString(),
                                     Referral = row["Referral"].ToString(),
                                     AddedBy = Convert.ToInt32(row["AddedBy"].ToString()),
                                     DateAdded = row["DateAdded"].ToString(),
                                     PropertyID = row["PropertyID"].ToString(),
                                     Address = row["Address"].ToString(),
                                     RoomNo = row["RoomNo"].ToString(),
                                     DailyRate = Convert.ToDouble(row["DailyRate"].ToString()),
                                     TotalOwedAMount = Convert.ToDouble(row["TotalOwedAMount"].ToString()),
                                     TenantsContactsList = (from DataRow row1 in dt.Tables[1].Rows
                                                            select new Contacts
                                                            {
                                                                ID = Convert.ToInt32(row1["ID"].ToString()),
                                                                number = row1["number"].ToString(),
                                                                label = row1["label"].ToString(),
                                                            }).ToList(),
                                     CriminalConvictionsList = (from DataRow row2 in dt.Tables[2].Rows
                                                                select new CriminalConvictions
                                                                {
                                                                    ID = Convert.ToInt32(row2["ID"].ToString()),
                                                                    CriminalConviction = row2["CriminalConviction"].ToString(),
                                                                    ConvictionDate = row2["ConvictionDate"].ToString(),
                                                                }).ToList(),
                                     TenantsIssuesList = (from DataRow row3 in dt.Tables[3].Rows
                                                          select new Issues
                                                          {
                                                              ID = Convert.ToInt32(row3["ID"].ToString()),
                                                              Issue = row3["Issue"].ToString(),
                                                          }).ToList(),
                                     SupportWorkerList = (from DataRow row4 in dt.Tables[4].Rows
                                                          select new SupportWorkersModel
                                                          {
                                                              ID = Convert.ToInt32(row4["ID"].ToString()),
                                                              SupportWorker = row4["SupportWorker"].ToString(),
                                                              Name = row4["Name"].ToString(),
                                                              MobileNumber = row4["MobileNumber"].ToString(),
                                                              TelephoneNumber = row4["TelephoneNumber"].ToString(),
                                                              Email = row4["Email"].ToString(),
                                                          }).ToList(),
                                     TenantsDocumentsList = (from DataRow row5 in dt.Tables[5].Rows
                                                             select new TenantsDocuments
                                                             {
                                                                 ID = Convert.ToInt32(row5["ID"].ToString()),
                                                                 FilePath = row5["FilePath"].ToString(),
                                                             }).ToList(),
                                     TenantsAddressList = (from DataRow row6 in dt.Tables[6].Rows
                                                           select new PropertyRoomModel
                                                           {
                                                               Address = row6["Address"].ToString(),
                                                               RoomNo = row6["RoomNo"].ToString(),
                                                               EntryDate = row6["EntryDate"].ToString(),
                                                               LeaveDate = row6["LeaveDate"].ToString(),

                                                           }).ToList(),

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
