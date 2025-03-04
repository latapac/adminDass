let lastTs;
// Function to fetch live data
async function getLiveData() {
    
    try {
        const response = await fetch('http://64.227.139.217:3000/getMachineData/12345');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
         if(lastTs===data.data[1].ts){
            console.log("no update");
            return
         }else{
            console.log("update");
            
            lastTs=data.data[1].ts
             updatePage(data.data[1]); // Pass only the 'd' object
         }
  
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  // Initialize Chart.js Pie Chart
  let oeeChart;

  function updateDonutChart(availability, performance, quality) {
  
    
    const ctx = document.getElementById('myPieChart').getContext('2d');

    if (oeeChart) {
        oeeChart.destroy();
    }

    oeeChart = new Chart(ctx, {
        type: 'doughnut', // Change 'pie' to 'doughnut'
        data: {
            labels: ['Availability', 'Performance', 'Quality'],
            datasets: [{
                data: [availability, performance, quality],
                backgroundColor: ['#17A2B8', '#28A745', '#FFC107'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`; // Show percentage with label
                        }
                    }
                },
                // Custom plugin to draw text in the middle of the donut
                datalabels: {
                    formatter: function(value, ctx) {
                        let total = ctx.chart._metasets[0].data.reduce((acc, cur) => acc + cur, 0);
                        let percent = ((value / total) * 100).toFixed(2) + '%';
                        return percent;
                    },
                    color: '#000', // Color of the text
                    font: {
                        size: 16, // Size of the font in the center
                        weight: 'bold'
                    },
                    align: 'center',
                    anchor: 'center'
                }
            },
            cutoutPercentage: 80, // Set the size of the donut hole (adjust to your preference)
        }
    });
}


// Fetch live data every 5 seconds


  
  // Function to update page content with live data
  function updatePage(data) {
    
    if (!data || typeof data !== 'object') {
        console.error("Invalid data format:", data);
        return;
    }
  
    const oee = data?.d["oee%"]?.[0] ?? 1;
    const runtime = data?.d["runtime"]?.[0] ?? 1;
    const stoptime = data?.d["stoptime"]?.[0] ?? 1;
    const errortime = data?.d["errortime"]?.[0] ?? 1;
    const totalprd = data?.d["totalprd"]?.[0] ?? 1;
    const goodprod = data?.d["goodprod"]?.[0] ?? 1;
    const rejprod = data?.d["rejprod"]?.[0] ?? 1;
    const aval = data?.d["aval"]?.[0] ?? 1;
    const qual = data?.d["qual"]?.[0] ?? 1;
    const perf = data?.d["perf"]?.[0] ?? 1;
  
    updateDonutChart(aval, perf, qual);
   
  
    document.getElementById('total_production').innerText = `${totalprd}`;
    document.getElementById('good_production').innerText = `${goodprod}`;
    document.getElementById('bad_production').innerText = `${rejprod}`;
    document.getElementById('runtime').style.width = `${runtime}%`
    document.getElementById('stoptime').style.width = `${stoptime}%`;
    document.getElementById('errortime').style.width = `${errortime}%`;
    document.getElementById('oee').innerText = `${oee.toFixed(1)}`;
  
    document.getElementById('aval').innerText = `${aval.toFixed(1)}%`;
    document.getElementById('perf').innerText = `${perf.toFixed(1)}%`;
    document.getElementById('qual').innerText = `${qual.toFixed(1)}%`;
  
  }
  
  // Fetch data periodically (every 10 seconds)
  setInterval(getLiveData, 5000);
  
  // Initial data fetch
  getLiveData();


  
  