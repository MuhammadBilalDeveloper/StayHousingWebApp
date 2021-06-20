using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StayHousingModel
{
    public class PaymentsModel
    {
        public int ID { get; set; }
        public string PaymentID  { get; set; }
        public string TenantsID { get; set; }
        public string DateCalled { get; set; }
        public string Period { get; set; }
        public double Amount { get; set; }
        public double TotalOwedAmount { get; set; }
        public double TotalAmount { get; set; }
        public double RemainingAmount { get; set; }
        public string Status { get; set; }
        public string GStatus { get; set; }
        public string Comments { get; set; }
        public string AddedBy { get; set; }
        public string DateAdded { get; set; }
    }
}
