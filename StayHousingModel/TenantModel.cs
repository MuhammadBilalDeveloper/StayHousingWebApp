using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StayHousingModel
{
    public class TenantModel
    {
        public int ID { get; set; }
        public string TenantsID { get; set; }
        public int SLNO { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string Surname { get; set; }
        public string FullName { get; set; }
        public string DOB { get; set; }
        public string Gender { get; set; }
        public string ContactNo { get; set; }
        public string NI { get; set; }
        public string CRN { get; set; }
        public string Issues { get; set; }
        public string CriminalConviction { get; set; }
        public string SupportWorker { get; set; }
        public string SocialWorker { get; set; }
        public string IsLeft { get; set; }
        public string CheckOutDate { get; set; }
        public string IsFirstTime { get; set; }
        public string CheckInDate { get; set; }
        public string ProfileStatus { get; set; }
        public string Status { get; set; }
        public string LeaversStatus { get; set; }
        public string ImagePath { get; set; }
        public string Referral { get; set; }
        public int AddedBy { get; set; }
        public string DateAdded { get; set; }
        public int UpdatedBy { get; set; }
        public string DateUpdated { get; set; }
        public string FirstCheckin { get; set; }
        public string LastPaymentDate { get; set; }
        public string DateCalled { get; set; }
        public string JoiningDate { get; set; }
        
        public string PreviousImage { get; set; }
        public string PropertyID { get; set; }
        public string Address { get; set; }
        public string RoomNo { get; set; }
        public double DailyRate { get; set; }
        public double TotalOwedAMount { get; set; }


        public List<PropertyRoomModel> TenantsAddressList { get; set; }
        public List<Contacts> TenantsContactsList { get; set; }
        public List<Issues> TenantsIssuesList { get; set; }
        public List<CriminalConvictions> CriminalConvictionsList { get; set; }
        public List<TenantsDocuments> TenantsDocumentsList { get; set; }
        public List<TenantsCheckinCheckout> TenantsCheckinCheckoutList { get; set; }
        public List<SupportWorkersModel> SupportWorkerList { get; set; }
    }

    public class PropertyRoomModel
    {
        public int ID { get; set; }
        public string PropertyID { get; set; }
        public string RoomNo { get; set; }
        public string FullName { get; set; }
        public string TenantsID { get; set; }
        public int IsOccupied { get; set; }
        public string Address { get; set; }
        public string EntryDate { get; set; }
        public string LeaveDate { get; set; }
    }

     public class Contacts
     {
            public int ID { get; set; }
            public string TenantsID { get; set; }
            public string number { get; set; }
            public string label { get; set; }
           public string DateAdded { get; set; }
     }

    public class Issues
    {
        public int ID { get; set; }
        public string TenantsID { get; set; }
        public string Issue { get; set; }
        public string DateAdded { get; set; }
    }
    public class CriminalConvictions
    {
        public int ID { get; set; }
        public string TenantsID { get; set; }
        public string CriminalConviction { get; set; }
        public string ConvictionDate { get; set; }
        public string DateAdded { get; set; }
    }

    public class SupportWorkersModel
    {
        public int ID { get; set; }
        public string SupportWorker { get; set; }
        public string Name { get; set; }
        public string MobileNumber { get; set; }
        public string TelephoneNumber { get; set; }
        public string Email { get; set; }
    }

    public class TenantsDocuments
    {
        public int ID { get; set; }
        public string TenantsID { get; set; }
        public string Path { get; set; }
        public string FilePath { get; set; }
        public string DateAdded { get; set; }
    }

    public class TenantsCheckinCheckout
    {
        public int ID { get; set; }
        public string TenantsID { get; set; }
        public string Checkin { get; set; }
        public string Checkout { get; set; }
        public string DateAdded { get; set; }
    }
}
