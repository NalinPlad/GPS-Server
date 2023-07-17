const status = document.querySelector("#status");

function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (ms < 100) return ms + " ms";
  else if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days"
}


let ind = 1;
function logData(msg,color) {
  const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: true});
  status.innerHTML += `<span style="color:grey;font-size:5pt;overflow:scroll"> ${time}</span><br><span style="color:${color};display:flex;align-items:center;overflow:scroll"><span style="color:grey;font-size:5pt;margin-right:0.5rem">[${ind}]</span>${msg}</span><br>`;
  ind++;
}

logData(`Connected to server on host ${location.hostname}`, "green");

function initGeoLocation() {
  const startTimestamp = Date.now();

  function success(position) {
    const finishTimestamp = Date.now();
    logData(`Geolocation Found. Took ${msToTime(finishTimestamp-startTimestamp)}`, "green");
  }
  function error() {
    logData(`Unable to retrieve your location. Maybe you denied permissions?`, "red");
  }

  if (!navigator.geolocation) {
    logData(`Geolocation API is not supported by your browser`, "red");
  } else {
    logData(`Locating...`, "orange");
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function initWebSocketConnection() {
  ws = new WebSocket("wss://" + location.hostname + ":8765");

  ws.onopen = function (event) {
    ws.send("clientping");
    logData(`WebSocket Connection Initialized`, "green");
  }

  ws.onmessage = function (event) {
    if (event.data == "serverpong") {
      logData(`WebSocket Connection is alive`, "green");
    } else {
      switch (event.data) {
          case "start":
            logData(`Starting Sending Data!`, "green");
            setInterval(() => {
              navigator.geolocation.getCurrentPosition((position) => {
                ws.send(JSON.stringify({
                  "lat": position.coords.latitude,
                  "long": position.coords.longitude,
                  "timestamp": position.timestamp
                }));
              }
              );
            }, 500);
      }
    }
  }

  ws.onclose = function (event) {
    logData(`WebSocket Connection Closed`, "orange");
  }
}

document.querySelector("#wsinit").addEventListener("click", initWebSocketConnection);
document.querySelector("#init").addEventListener("click", initGeoLocation);
