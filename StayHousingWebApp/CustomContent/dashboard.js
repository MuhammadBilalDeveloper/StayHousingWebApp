$(function () {
   
    LoadAllInitialData();
});

function LoadAllInitialData() {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Dashboard/LoadAllInitialData",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {
            var TenantsDonutData = [];
            var PropertyDonutData = [];
            var MonthWiseAmountLIstData = [];
            var MonthWiseAmountLIstLabels = [];

            var totalNotification = 0;
            var notificationHTM = "";

            $.each(results.data, function (i, item) {
                if (item.TotalActiveTenants+item.TotalClearedTenants+item.TotalOutstandingTenants > 0) {
                    TenantsDonutData.push(item.TotalActiveTenants);
                    TenantsDonutData.push(item.TotalOutstandingTenants);
                    TenantsDonutData.push(item.TotalClearedTenants);
                }

                if (item.TotalEmptyRooms + item.TotalOccupiedRooms > 0) {

                    PropertyDonutData.push(item.TotalOccupiedRooms);
                    PropertyDonutData.push(item.TotalEmptyRooms);
                }

                $("#TotalUsers").text(item.TotalUsers);
                $("#TotalTenants").text(item.TotalTenants);
                $("#TotalProperties").text(item.TotalProperties);
                $("#TotalRooms").text(item.TotalRooms);

            })

            $.each(results.data[0].MonthWiseAmountLIst, function (i, item) {
                MonthWiseAmountLIstData.push(item.Amount);
                MonthWiseAmountLIstLabels.push(item.MonthName);
            })           

            if (TenantsDonutData.length > 0) {
                LoadTenantsDonutChart(TenantsDonutData);
            } else {
                $("#TenantsChart").addClass("hidden");
            }
            if (PropertyDonutData.length > 0) {
                LoadPropertiesPieChart(PropertyDonutData);
            } else {
                $("#PropertyChart").addClass("hidden");
            }
            if (MonthWiseAmountLIstData.length > 0) {
                loadMonthlyAmountChart(MonthWiseAmountLIstData, MonthWiseAmountLIstLabels);
            } else {
                $("#AmountChart").addClass("hidden");
            }
          
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function LoadTenantsDonutChart(data) {
  
    var colors = ["#6658dd", "#4fc6e1", "#F1556C"];
    var dataColors = $("#apex-pie-2").data('colors');
    if (dataColors) {
        colors = dataColors.split(",");
    }
    var options = {
        plotOptions: {
            pie: {
                startAngle: 0,
                expandOnClick: true,
                offsetX: 0,
                offsetY: 0,
                customScale: 1,
                dataLabels: {
                    offset: 0,
                    minAngleToShowLabel: 10
                },
                donut: {
                    size: '65%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: false,
                            label: 'Total',
                            fontSize: '22px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 600,
                            color: '#F44336',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b
                                }, 0)
                            }
                        }
                    }
                },
            }
        },
        chart: {
            height: 320,
            type: 'donut',
            foreColor: '#F44336',
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.3
            }
        },

        series: data,
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toFixed(2) + "%"
            },
            textAnchor: 'middle',
            distributed: false,
            offsetX: 0,
            offsetY: 0,
            style: {
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
            },
            dropShadow: true,
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 7,
        },
        labels: ["Active", "Outstanding", "Cleared"],

        colors: colors,
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 240
                },
                legend: {
                    show: false
                },
            }
        }],
        fill: {
            type: 'solid'
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#apex-pie-2"),
        options
    );

    chart.render();
}

function LoadPropertiesPieChart(data) {

    var colors = ["#6658dd", "#4fc6e1"];
    var dataColors = $("#apex-pie-1").data('colors');
    if (dataColors) {
        colors = dataColors.split(",");
    }
    var options = {
       
        chart: {
            height: 320,
            type: 'pie',
            foreColor: '#F44336',
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.3
            }
        },

        series: data,
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toFixed(2) + "%"
            },
            textAnchor: 'middle',
            distributed: false,
            offsetX: 0,
            offsetY: 0,
            style: {
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
            },
            dropShadow: true,
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 7,
        },
        labels: ["Occupied", "Empty"],

        colors: colors,
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    height: 240
                },
                legend: {
                    show: false
                },
            }
        }],
        fill: {
            type: 'solid'
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#apex-pie-1"),
        options
    );

    chart.render();
}

function loadMonthlyAmountChart(MonthWiseAmountLIstData, MonthWiseAmountLIstLabels) {

    var colors = ['#f672a7'];
    var dataColors = $("#apex-line-2").data('colors');
    if (dataColors) {
        colors = dataColors.split(",");
    }
    var options = {
        chart: {
            height: 290,
            type: 'line',
            shadow: {
                enabled: false,
                color: '#bbb',
                top: 3,
                left: 2,
                blur: 3,
                opacity: 1
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 5,
            curve: 'smooth'
        },
        series: [{
            name: 'Amount',
            data: MonthWiseAmountLIstData
        }],
        xaxis: {
            type: 'text',
            categories: MonthWiseAmountLIstLabels,
        },
        title: {
            text: 'Amount',
            align: 'left',
            style: {
                fontSize: "14px",
                color: '#666'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: colors,
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 1000, 3000, 6000,12000,25000,50000,100000,200000,500000,1000000,5000000,100000000]
            },
        },
        markers: {
            size: 4,
            opacity: 0.9,
            colors: ["#56c2d6"],
            strokeColor: "#fff",
            strokeWidth: 2,
            style: 'inverted', // full, hollow, inverted
            hover: {
                size: 7,
            }
        },
        yaxis: {
            min: 0,
            max: Math.max.apply(null, MonthWiseAmountLIstData),
            title: {
                text: '',
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2
            },
            borderColor: '#185a9d'
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: false
                },
            }
        }]
    }

    var chart = new ApexCharts(
        document.querySelector("#apex-line-2"),
        options
    );

    chart.render();
}

