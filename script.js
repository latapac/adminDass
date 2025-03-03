let lastTs;
// Function to fetch live data
async function getLiveData() {
    
    try {
        const response = await fetch('http://64.227.139.217:3000/getMachineData/12345');
        console.log("l");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); 
        console.log(data);
        
      
        console.log("Fetched Data:", data.data[1].ts,lastTs);
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

async function fetchLiveData() {
    try {
        const response = await fetch('http://64.227.139.217:3000/getMachineData/12345'); // Replace with your actual API endpoint
        const data = await response.json();
        
        const availability = data.availability;
        const performance = data.performance;
        const quality = data.quality;

        updatePieChart(availability, performance, quality);
    } catch (error) {
        console.error("Error fetching OEE data:", error);
    }
}

function updatePieChart(availability, performance, quality) {
    const ctx = document.getElementById('myPieChart').getContext('2d');

    if (oeeChart) {
        oeeChart.destroy();
    }

    oeeChart = new Chart(ctx, {
        type: 'pie',
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
                }
            }
        }
    });
}

// Fetch live data every 5 seconds
fetchLiveData();
setInterval(fetchLiveData, 5000);

  
  // Function to update page content with live data
  function updatePage(data) {
    console.log(data);
    
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
  
    console.log("Updated Data:", { oee, runtime, stoptime, errortime, totalprd, goodprod, rejprod });
  
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
  
    createPieChart(aval, perf, qual);
  }
  
  // Fetch data periodically (every 10 seconds)
  setInterval(getLiveData, 5000);
  
  // Initial data fetch
  getLiveData();


  
  