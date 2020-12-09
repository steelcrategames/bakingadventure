const LOG_TYPES = {
    GOOD: "bg-success",
    INFO: "bg-info",
    DEFAULT: "",
    WARN: "bg-warning",
    BAD: "bg-danger"
}

var currentAdventurer = {};

function createRandomAdventurer()
{
    var appetites = [ "small", "medium", "large" ];
    var skillLevels = [ "Novice", "Apprentice", "Experienced", "Savvy" ];
    var titles = [ "Knight", "Squire", "Bard", "Adventurer", "Farmer" ];

    var title = skillLevels[Math.floor(Math.random() * skillLevels.length)] + " " + titles[Math.floor(Math.random() * titles.length)];

    var name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + "immy";

    return {
        name: name,
        title: "the " + title,
        quote: name + "'s the name and adventuring is my game!",
        atk: getRndInteger(1, 5),
        def:  getRndInteger(1, 5),
        hp:  getRndInteger(3, 8),
        appetite: appetites[Math.floor(Math.random() * appetites.length)]
    };
}

//Random integer, in range [min, max]
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

function updateAdventurerStatBox()
{
    document.getElementById("adventurerName").innerText = currentAdventurer.name;
    document.getElementById("adventurerTitle").innerText = currentAdventurer.title;
    document.getElementById("adventurerQuote").innerText = currentAdventurer.quote;
    document.getElementById("adventurerATK").innerText = currentAdventurer.atk;
    document.getElementById("adventurerDEF").innerText = currentAdventurer.def;
    document.getElementById("adventurerHP").innerText = currentAdventurer.hp;
    document.getElementById("adventurerAppetite").innerText = currentAdventurer.appetite;
}

//First meeting of an adventurer - do an introduction
function doAdventurerIntro()
{
    currentAdventurer = createRandomAdventurer();
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