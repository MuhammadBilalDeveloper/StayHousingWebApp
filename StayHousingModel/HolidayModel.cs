using System;
using System.Collections.Generic;
using System.Text;

namespace StayHousingModel
{
    public class HolidayModel
    {
        public int ID { get; set; }
        public int SLNO { get; set; }
        public DateTime HolidayDate { get; set; }
        public DateTime HolidayEndDate { get; set; }
        public string HolidayType { get; set; }
        public string Reason { get; set; }
        public string FullName { get; set; }
        public int AddedBy { get; set; }
        public bool IsApproved { get; set; }
        public int UserAccountID { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsActive { get; set; }
        public string Approved { get; set; }
        public string Leaves { get; set; }
        public string AvailLeaves { get; set; }
        public string Days { get; set; }
        public DateTime ApprovalDate { get; set; }
        public DateTime PermissionDate { get; set; }
        public string PermissionBy { get; set; }
        public bool Permission { get; set; }
        public string ApprovedBy { get; set; }

    }
}