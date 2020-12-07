const LOG_TYPES = {
    GOOD: "bg-success",
    INFO: "bg-info",
    DEFAULT: "",
    WARN: "bg-warning",
    BAD: "bg-danger"
}

function doAdventure() 
{
    clearLog();
    log("Timmy beings his adventure!");
    log("Timmy encounters troll!", LOG_TYPES.INFO);
    log("Troll attacks Timmy! Timmy is hurt!", LOG_TYPES.BAD);
    log("Timmy flees from Troll and gets away safely.", LOG_TYPES.WARN);
    log("Timmy returns to town without further excitement.");
    log("Adventure complete!", LOG_TYPES.GOOD);
}

function log(msg, type)
{
    var log = document.getElementById("log");
    var logMsg = document.createElement("p");
    var span = document.createElement("span");
    span.classList.add(type);
    span.appendChild(document.createTextNode(msg));
    logMsg.appendChild(span);
    log.appendChild(logMsg);
}

function clearLog()
{
    var log = document.getElementById("log");
    log.innerHTML = '';
}