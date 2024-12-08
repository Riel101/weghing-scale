// Replace with the IP address of your ESP32
const esp32Url = "http://192.168.1.100/data";

// History data arrays
let weightHistory = [];
let currencyHistory = [];

async function fetchData() {
  try {
    const response = await fetch(esp32Url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    
    // Update current weight and currency
    document.getElementById("weight-value").innerText = `${data.weight} kg`;
    document.getElementById("currency").innerText = `₦ ${data.currency}`;

    // Add to history
    weightHistory.push(data.weight);
    currencyHistory.push(data.currency);

    // Update the graph
    updateGraph();

    // Convert weight to Naira
    const conversionRate = document.getElementById("conversion-rate").value;
    const convertedNaira = (data.weight * conversionRate).toFixed(2);
    document.getElementById("converted-naira").innerText = `₦ ${convertedNaira}`;

  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("weight-value").innerText = "Error loading weight";
    document.getElementById("currency").innerText = "Error loading currency";
  }
}

function updateGraph() {
  const ctx = document.getElementById("weightHistoryChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: weightHistory.length }, (_, i) => `Entry ${i + 1}`),
      datasets: [{
        label: "Weight (kg)",
        data: weightHistory,
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      }, {
        label: "Currency (₦)",
        data: currencyHistory,
        borderColor: "rgb(255, 99, 132)",
        fill: false,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Fetch data every 2 seconds
setInterval(fetchData, 2000);
