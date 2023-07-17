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



function initGeoLocation() {
  const startTimestamp = Date.now();

  function success(position) {
    const finishTimestamp = Date.now();
    status.innerHTML += `<span style="color:green">Geolocation API Initialized. Took <b>${msToTime(finishTimestamp-startTimestamp)}</b></span><br>`;
  }
  function error() {
    status.innerHTML += `<span style="color:orange">Unable to retrieve your location. Maybe you denied permissions?</span><br>`;
  }

  if (!navigator.geolocation) {
    status.innerHTML += `<span style="color:red">Geolocation is not supported by your browser</span><br>`;
  } else {
    status.innerHTML += `<span style="color:orange">Locating…</span><br>`;
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function initWebSocketConnection() {
  ws = new WebSocket("wss://" + location.hostname + ":8765");

  ws.onopen = function (event) {
    ws.send("Hello Server!");
    status.innerHTML += `<span style="color:green">WebSocket Connection Initialized</span><br>`;
  }

  ws.onclose = function (event) {
    status.innerHTML += `<span style="color:red">WebSocket Connection Closed</span><br>`;
  }
}

document.querySelector("#wsinit").addEventListener("click", initWebSocketConnection);
document.querySelector("#init").addEventListener("click", initGeoLocation);
