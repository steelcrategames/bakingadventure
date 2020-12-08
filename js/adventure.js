const LOG_TYPES = {
    GOOD: "bg-success",
    INFO: "bg-info",
    DEFAULT: "",
    WARN: "bg-warning",
    BAD: "bg-danger"
}

var currentAdventurer = createRandomAdventurer();

function createRandomAdventurer()
{
    return {
        name: "Timmy",
        title: "the Novice Night",
        quote: "Timmy's the name and adventuring is my game!",
        atk: 2,
        def: 1,
        appetite: "small"
    };
}

function updateAdventurerStatBox()
{
    document.getElementById("adventurerName").innerText = currentAdventurer.name;
    document.getElementById("adventurerTitle").innerText = currentAdventurer.title;
    document.getElementById("adventurerQuote").innerText = currentAdventurer.quote;
    document.getElementById("adventurerATK").innerText = currentAdventurer.atk;
    document.getElementById("adventurerDEF").innerText = currentAdventurer.def;
    document.getElementById("adventurerAppetite").innerText = currentAdventurer.appetite;
}

//First meeting of an adventurer - do an introduction
function doAdventurerIntro()
{
    updateAdventurerStatBox();
    document.getElementById("adventurerStatBox").style.display = "block";

    clearLog();
    log("Hi, I'm " + currentAdventurer.name);
    log("I just moved into the area and heard about a great restaurant. People say it's the place to go for new adventurers!");
    log("I just bought my first armor and am really excited to go on a quest.");
}

//Before each quest - describe what lies ahead
function doQuestIntro()
{
    clearLog();
    log("I'm heading out to my first quest in the goblin cave.");
    log("I'm a bit nervous. Do you have anything that might help soothe my nerves?");
}

//After each quest - recap what happened
function doQuestRecap()
{
    clearLog();
    log("I just returned from the goblin cave.");
    log("Even the entrance was scary but I was strangely calm.", LOG_TYPES.INFO);
    log("On the first level, I was attacked by two goblins but kept my wits and managed to press on.", LOG_TYPES.GOOD);
    log("On the second level, I was poisoned and started to feel really sick so I had to escape.", LOG_TYPES.BAD);
    log("I did not complete my quest.");
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