using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StayHousingModel
{

    
    public class PropertyModel
    {
        public int ID { get; set; }
        public int SLNO { get; set; }
        public string PropertyID { get; set; }
        public int PropertyTypeID { get; set; }
        public string PropertyType { get; set; }
        public string Address { get; set; }
        public string Area { get; set; }
        public string Postcode { get; set; }
        public string NumberOfRooms { get; set; }
        public string SupportWorker { get; set; }
        public string CouncilActiveDate { get; set; }
        public string HouseCameFrom { get; set; }
        public string LandlordName { get; set; }
        public string LandlordContactNo { get; set; }
        public string LeaseDuration { get; set; }
        public string AddedBy { get; set; }
        public string DateAdded { get; set; }
        public string OccupiedRoom { get; set; }
        public string EmptyRoom { get; set; }
        public double WeeklyRate { get; set; }
        public double DailyRate { get; set; }
        public string HousingAssociation { get; set; }
        public string Company { get; set; }
        public string CompanyName { get; set; }
        

        public List<PropertyImagesModel> PropertyImagesList { get; set; }
        public List<PropertyCertificatesModel> PropertyCertificatesList { get; set; }
        public List<PropertyLandlorIDsModel> PropertyLandlordIDSList { get; set; }
        public List<PropertyRoomModel> PropertyTenantsList { get; set; }
    }
    public class PropertyTypeModel
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public List<CompanyModel> CompanyModelList { get; set; }
    }

    public class PropertyImagesModel
    {
        public int ID { get; set; }
        public string PropertyID { get; set; }
        public string ImagePath { get; set; }
    }

    public class PropertyCertificatesModel
    {
        public int ID { get; set; }
        public string PropertyID { get; set; }
        public string FilePath { get; set; }
        public string CertificateType { get; set; }
        public string ExpairyDate { get; set; }
    }

    public class PropertyLandlorIDsModel
    {
        public int ID { get; set; }
        public string PropertyID { get; set; }
        public string FilePath { get; set; }
    }

}
