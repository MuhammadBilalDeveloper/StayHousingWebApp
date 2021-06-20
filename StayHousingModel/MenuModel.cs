using System;
using System.Collections.Generic;
using System.Text;

namespace StayHousingModel
{
    public class MenuModel
    {
        public int ID { get; set; }
        public int SLNO { get; set; }
        public string MenuLink { get; set; }
        public string MenuTitle { get; set; }
        public string ParentTitle { get; set; }
        public bool IsActive { get; set; }
        public bool IsExist { get; set; }
    }
}
