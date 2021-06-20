using System;
using System.Collections.Generic;
using System.Text;

namespace StayHousingModel
{
    public class UserAccountModel
    {
        public int ID { get; set; }
        public int SLNO { get; set; }
        public string EmployeeCode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string SurName { get; set; }
        public string PreviousImage { get; set; }
        public string ImagePath { get; set; }
        public string Gender { get; set; }
        public string DOB { get; set; }
        public int GroupID { get; set; }
        public string GroupTitle { get; set; }
        public bool IsActive { get; set; }
        public string DateAdded { get; set; }
        public string AddedBy { get; set; }
        public string DateUpdated { get; set; }
        public string UpdatedBy { get; set; }
        public string LastLogged { get; set; }
        public string Menus { get; set; }
        public string Company { get; set; }
        public string CompanyName { get; set; }
        public string HolidayStartDate { get; set; }
        public decimal? HolidayEntitlement { get; set; }
        public decimal? HoursWorked { get; set; }
        public decimal? Daysworked { get; set; }
        public string ContractType { get; set; }
    }
}
