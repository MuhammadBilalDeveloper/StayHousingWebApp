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
    public class PropertyList
    {
        public string InsertProperty(PropertyModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@PropertyID", model.PropertyID);
            dAd.Parameters.AddWithValue("@Address", model.Address);
            dAd.Parameters.AddWithValue("@Area", model.Area);
            dAd.Parameters.AddWithValue("@Postcode", model.Postcode);
            dAd.Parameters.AddWithValue("@PropertyTypeID", model.PropertyTypeID);
            dAd.Parameters.AddWithValue("@NumberOfRooms", model.NumberOfRooms);
            dAd.Parameters.AddWithValue("@SupportWorker", model.SupportWorker);
            dAd.Parameters.AddWithValue("@CouncilActiveDate", model.CouncilActiveDate);
            dAd.Parameters.AddWithValue("@HouseCameFrom", model.HouseCameFrom);
            dAd.Parameters.AddWithValue("@LandlordContactNo", model.LandlordContactNo);
            dAd.Parameters.AddWithValue("@LandlordName", model.LandlordName);
            dAd.Parameters.AddWithValue("@WeeklyRate", model.WeeklyRate);
            dAd.Parameters.AddWithValue("@DailyRate", model.DailyRate);
            dAd.Parameters.AddWithValue("@LeaseDuration", model.LeaseDuration);
            dAd.Parameters.AddWithValue("@HousingAssociation", model.HousingAssociation);
            dAd.Parameters.AddWithValue("@Company", model.Company);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
            if (model.ID > 0)
                dAd.Parameters.AddWithValue("@QueryOption", 2);
            else
                dAd.Parameters.AddWithValue("@QueryOption", 1);

            SqlParameter OUTPUT = new SqlParameter("@OUTPUT", SqlDbType.VarChar, 50) { Direction = ParameterDirection.Output };
            dAd.Parameters.Add(OUTPUT);

            try
            {               

                int rslt = dAd.ExecuteNonQuery();
                if (rslt > 0)
                {
                    return OUTPUT.Value.ToString();
                }
                else
                {
                    return "Failed";
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<PropertyModel> LoadAllProperty(PropertyModel model)
        {
            List<PropertyModel> modelList = new List<PropertyModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@Address", model.Address);
            dAd.Parameters.AddWithValue("@Area", model.Area);
            dAd.Parameters.AddWithValue("@Postcode", model.Postcode);
            dAd.Parameters.AddWithValue("@PropertyType", model.PropertyType);
            dAd.Parameters.AddWithValue("@HouseCameFrom", model.HouseCameFrom);
            dAd.Parameters.AddWithValue("@NumberOfRooms", model.NumberOfRooms);
            dAd.Parameters.AddWithValue("@SupportWorker", model.SupportWorker);
            dAd.Parameters.AddWithValue("@LandlordName", model.LandlordName);
            dAd.Parameters.AddWithValue("@Company", SessionVar.Menus.Contains("35") == true ? "0" : SessionVar.Company);
            dAd.Parameters.AddWithValue("@QueryOption", 3);
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
                                     OccupiedRoom = row["OccupiedRoom"].ToString(),
                                     EmptyRoom = row["EmptyRoom"].ToString(),
                                     HousingAssociation = row["HousingAssociation"].ToString(),
                                     CompanyName = row["CompanyName"].ToString(),
                                     WeeklyRate = Convert.ToDouble(row["WeeklyRate"].ToString()),
                                     DailyRate = Convert.ToDouble(row["DailyRate"].ToString()),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<PropertyModel> LoadPropertyDetails(PropertyModel model)
        {
            List<PropertyModel> modelList = new List<PropertyModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 16);
            DataSet ds = new DataSet();

            try
            {
                sda.Fill(ds);

                if (ds.Tables[0].Rows.Count > 0)
                {
                    modelList = (from DataRow row in ds.Tables[0].Rows
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
                                     HousingAssociation = row["HousingAssociation"].ToString(),
                                     CompanyName = row["CompanyName"].ToString(),
                                     WeeklyRate = Convert.ToDouble(row["WeeklyRate"].ToString()),
                                     DailyRate = Convert.ToDouble(row["DailyRate"].ToString()),
                                     PropertyImagesList = (from DataRow row1 in ds.Tables[1].Rows
                                                                 select new PropertyImagesModel
                                                                 {
                                                                     ID = Convert.ToInt32(row1["ID"].ToString()),
                                                                     PropertyID = row1["PropertyID"].ToString(),
                                                                     ImagePath = row1["ImagePath"].ToString(),
                                                                 }).ToList(),
                                     PropertyCertificatesList = (from DataRow row1 in ds.Tables[2].Rows
                                                                 select new PropertyCertificatesModel
                                                                 {
                                                                     ID= Convert.ToInt32(row1["ID"].ToString()),
                                                                     PropertyID = row1["PropertyID"].ToString(),
                                                                     CertificateType= row1["CertificateType"].ToString(),
                                                                     ExpairyDate = row1["ExpairyDate"].ToString(),
                                                                     FilePath = row1["FilePath"].ToString(),
                                                                 }).ToList(),
                                     PropertyLandlordIDSList = (from DataRow row1 in ds.Tables[3].Rows
                                                                 select new PropertyLandlorIDsModel
                                                                 {
                                                                     ID = Convert.ToInt32(row1["ID"].ToString()),
                                                                     PropertyID = row1["PropertyID"].ToString(),
                                                                     FilePath = row1["FilePath"].ToString(),
                                                                 }).ToList(),
                                     PropertyTenantsList = (from DataRow row1 in ds.Tables[4].Rows
                                                                select new PropertyRoomModel
                                                                {
                                                                    PropertyID = row1["PropertyID"].ToString(),
                                                                    RoomNo = row1["RoomNo"].ToString(),
                                                                    FullName = row1["FullName"].ToString(),
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

        public List<PropertyModel> LoadSelectedProperty(PropertyModel model)
        {
            List<PropertyModel> modelList = new List<PropertyModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 4);
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
                                     HousingAssociation = row["HousingAssociation"].ToString(),
                                     Company = row["Company"].ToString(),
                                     WeeklyRate = Convert.ToDouble(row["WeeklyRate"].ToString()),
                                     DailyRate = Convert.ToDouble(row["DailyRate"].ToString()),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int DeleteProperty(PropertyModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
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

        public List<PropertyTypeModel> LoadAllPropertyType()
        {
            List<PropertyTypeModel> modelList = new List<PropertyTypeModel>();
            List<CompanyModel> CompanyModelList = new List<CompanyModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
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
                                 select new PropertyTypeModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     Title = row["Title"].ToString()
                                 }).ToList();

                    CompanyModelList = (from DataRow row in dt.Tables[1].Rows
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


        public int InsertPropertyImages(PropertyImagesModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@PropertyID", model.PropertyID);
            dAd.Parameters.AddWithValue("@ImagePath", model.ImagePath);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
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

        public List<PropertyImagesModel> LoadPropertyImages(PropertyImagesModel model)
        {
            List<PropertyImagesModel> modelList = new List<PropertyImagesModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 8);
            dAd.Parameters.AddWithValue("@PropertyID", model.PropertyID);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new PropertyImagesModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     PropertyID = row["PropertyID"].ToString(),
                                     ImagePath = row["ImagePath"].ToString()
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int DeletePropertyImage(PropertyImagesModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
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

        public int InsertPropertyCertificates(PropertyCertificatesModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@PropertyID", model.PropertyID);
            dAd.Parameters.AddWithValue("@FilePath", model.FilePath);
            dAd.Parameters.AddWithValue("@CertificateType", model.CertificateType);
            dAd.Parameters.AddWithValue("@ExpairyDate", model.ExpairyDate);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
            dAd.Parameters.AddWithValue("@QueryOption", 10);

            try
            {

                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<PropertyCertificatesModel> LoadPropertyCertificates(PropertyCertificatesModel model)
        {
            List<PropertyCertificatesModel> modelList = new List<PropertyCertificatesModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 11);
            dAd.Parameters.AddWithValue("@PropertyID", model.PropertyID);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new PropertyCertificatesModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     PropertyID = row["PropertyID"].ToString(),
                                     FilePath = row["FilePath"].ToString(),
                                     CertificateType= row["CertificateType"].ToString(),
                                     ExpairyDate= row["ExpairyDate"].ToString()
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int DeletePropertyCertificate(PropertyCertificatesModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 12);

            try
            {

                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertPropertyLandlordID(PropertyLandlorIDsModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@PropertyID", model.PropertyID);
            dAd.Parameters.AddWithValue("@FilePath", model.FilePath);
            dAd.Parameters.AddWithValue("@AddedBy", 1);
            dAd.Parameters.AddWithValue("@QueryOption", 13);

            try
            {

                return dAd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<PropertyLandlorIDsModel> LoadPropertyLandlordIDs(PropertyLandlorIDsModel model)
        {
            List<PropertyLandlorIDsModel> modelList = new List<PropertyLandlorIDsModel>();

            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            SqlDataAdapter sda = new SqlDataAdapter(dAd);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@QueryOption", 14);
            dAd.Parameters.AddWithValue("@PropertyID", model.PropertyID);
            DataTable dt = new DataTable();

            try
            {
                sda.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    modelList = (from DataRow row in dt.Rows
                                 select new PropertyLandlorIDsModel
                                 {
                                     ID = Convert.ToInt32(row["ID"].ToString()),
                                     PropertyID = row["PropertyID"].ToString(),
                                     FilePath = row["FilePath"].ToString(),
                                 }).ToList();

                }
                return modelList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int DeletePropertyLandlordID(PropertyLandlorIDsModel model)
        {
            SqlConnection conn = new SqlConnection(DBConnector.GetConnection());
            conn.Open();
            SqlCommand dAd = new SqlCommand("SP_Property", conn);
            dAd.CommandType = CommandType.StoredProcedure;
            dAd.Parameters.AddWithValue("@ID", model.ID);
            dAd.Parameters.AddWithValue("@QueryOption", 15);

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
