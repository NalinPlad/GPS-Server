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

    var reason;
    alert(event.code);
    // See https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
    if (event.code == 1000)
        reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
    else if(event.code == 1001)
        reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
    else if(event.code == 1002)
        reason = "An endpoint is terminating the connection due to a protocol error";
    else if(event.code == 1003)
        reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
    else if(event.code == 1004)
        reason = "Reserved. The specific meaning might be defined in the future.";
    else if(event.code == 1005)
        reason = "No status code was actually present.";
    else if(event.code == 1006)
       reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
    else if(event.code == 1007)
        reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
    else if(event.code == 1008)
        reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
    else if(event.code == 1009)
       reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
    else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
        reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
    else if(event.code == 1011)
        reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
    else if(event.code == 1015)
        reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
    else
        reason = "Unknown reason";
    
    logData(`Reason: ${reason}`, "orange");
    alert(reason)
  }
}

document.querySelector("#wsinit").addEventListener("click", initWebSocketConnection);
document.querySelector("#init").addEventListener("click", initGeoLocation);
