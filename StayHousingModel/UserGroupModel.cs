using System;
using System.Collections.Generic;
using System.Text;

namespace StayHousingModel
{
    public class UserGroupModel
    {
        public int ID { get; set; }
        public int SLNO { get; set; }
        public string Title { get; set; }
        public bool isActive { get; set; }
        public List<CompanyModel> CompanyModelList { get; set; }
    }
}
