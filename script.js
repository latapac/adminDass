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
  
  let oeeChart;


  function updateDonutChart(availability, performance, quality,oee) {
      const ctx = document.getElementById('myPieChart').getContext('2d');
  
      if (oeeChart) {
          oeeChart.destroy();
      }
  
      oeeChart = new Chart(ctx, {
          type: 'doughnut', // Doughnut chart
          data: {
              labels: ['Availability', 'Performance', 'Quality'],
              datasets: [{
                  data: [availability, performance, quality],
                  backgroundColor: ['#17A2B8', '#28A745', '#FFC107'],
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false, // Allow chart to resize freely
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
              },
              cutoutPercentage: 80, // Set donut hole size
          },
          plugins: [{
              // Draw "OEE" text in the center after drawing the chart
              beforeDraw: function(chart) {
                  const ctx = chart.ctx;
                  const width = chart.width;
                  const height = chart.height;
  
                  // Dynamically calculate font size based on chart's height and width
                  const fontSize = Math.min(width, height) / 10; // Makes text responsive
                  ctx.font = fontSize + "px sans-serif"; // Apply calculated font size
                  ctx.textBaseline = "middle";
                  ctx.fillStyle = "#000"; // Text color
                  ctx.textBaseline = "middle"
  
                  const text = "OEE:" + oee.toFixed(2) +"%";
                  const textX = Math.round((width - ctx.measureText(text).width) / 2); // Center text horizontally
                  const textY = height / 2; // Center text vertically
  
                  ctx.fillText(text, textX, textY);
              }
          }]
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
  
    updateDonutChart(aval, perf, qual,oee);
   
  
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


  
  