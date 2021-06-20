$(document).ready(function() {
    var table = $('#example').DataTable({
        "columnDefs": [
            { "visible": false, "targets": 2 }
        ],
        "order": [[ 2, 'asc' ]],
        "displayLength": 25,
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
            var subTotal = new Array();
            var groupID = -1;
            var aData = new Array();
            var index = 0;
            
            api.column(2, {page:'current'} ).data().each( function ( group, i ) {
            	
              // console.log(group+">>>"+i);
            
              var vals = api.row(api.row($(rows).eq(i)).index()).data();
              var salary = vals[5] ? parseFloat(vals[5]) : 0;
               
              if (typeof aData[group] == 'undefined') {
                 aData[group] = new Array();
                 aData[group].rows = [];
                 aData[group].salary = [];
              }
          
           		aData[group].rows.push(i); 
        			aData[group].salary.push(salary); 
                
            } );
    

            var idx= 0;

      
          	for(var office in aData){
       
									 idx =  Math.max.apply(Math,aData[office].rows);
      
                   var sum = 0; 
                   $.each(aData[office].salary,function(k,v){
                        sum = sum + v;
                   });
  									console.log(aData[office].salary);
                   $(rows).eq( idx ).after(
                        '<tr class="group"><td colspan="4">'+office+'</td>'+
                        '<td>'+sum+'</td></tr>'
                    );
                    
            };

        }
    } );

} );