const LOG_TYPES = {
    GOOD: "bg-success",
    INFO: "bg-info",
    DEFAULT: "",
    WARN: "bg-warning",
    BAD: "bg-danger"
}

const ADVENTURE_STATES = {
    empty_restaurant: 
    {
        onEnter: () => {
                clearLog();
                log("The restaurant is empty");
                showButton("meetNewAdventurerButton");

                hideButton("doQuestIntroButton");
                hideButton("giveFoodToAdventurerButton");
                hideButton("doQuestRecapButton");
             },
             onExit: () => 
             {
                hideButton("meetNewAdventurerButton");
             }
    },

    intro: 
    {
        onEnter: doAdventurerIntro
    },

    describe_quest: 
    {
        onEnter: () => showButton("doQuestIntroButton"),
        onExit: () => hideButton("doQuestIntroButton")
    },

    cooking:
    {
        onEnter: () => showButton("giveFoodToAdventurerButton"),
        onExit: () => hideButton("giveFoodToAdventurerButton")
    },

    quest_recap: 
    {
        onEnter: doQuestRecap
    }
}

class StateMachine {
    constructor(definition)
    {
        this.states = definition;
        this.current_state = null;
    }

    changeState(state)
    {
        if (this.current_state != null)
        {
            if (this.current_state.onExit != null)
            {
                this.current_state.onExit();
            }
        }

        this.current_state = state;

        if (this.current_state.onEnter != null)
        {
            this.current_state.onEnter();
        }
    }
}

class Adventurer
{
    constructor(name, title, quote, appetite)
    {
        this.name = name;
        this.title = title;
        this.quote = quote;

        this.atk = getRndInteger(1, 5),
        this.def =  getRndInteger(1, 5),
        this.hp =  getRndInteger(3, 8),
        this.appetite = appetite;

        this.food = null;
    }

    setFood(food)
    {
        this.food = food;
    }
}

var currentAdventurer = {};
    var adventureStateMachine = new StateMachine(ADVENTURE_STATES);

window.onload = () => {
    adventureStateMachine.changeState(ADVENTURE_STATES.empty_restaurant);
}

function createRandomAdventurer()
{
    const appetites = [ "small", "medium", "large" ];
    const skillLevels = [ "Novice", "Apprentice", "Experienced", "Savvy" ];
    const titles = [ "Knight", "Squire", "Bard", "Adventurer", "Farmer" ];

    let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + "immy";
    let title = "the" + skillLevels[Math.floor(Math.random() * skillLevels.length)] + " " + titles[Math.floor(Math.random() * titles.length)];
    let quote = name + "'s the name and adventuring is my game!";

    let appetite = appetites[Math.floor(Math.random() * appetites.length)];

    return new Adventurer(name, title, quote, appetite);
}

//Random integer, in range [min, max]
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function showButton(buttonName)
{
    document.getElementById(buttonName).style.display = "block";
}

function hideButton(buttonName)
{
    document.getElementById(buttonName).style.display = "none";
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

    if (currentAdventurer.food != null)
    {
        document.getElementById("adventurerFood").innerText = currentAdventurer.food.name;
    }
    else
    {
        document.getElementById("adventurerFood").innerText = "none";
    }
}


function meetNewAdventurer()
{
    adventureStateMachine.changeState(ADVENTURE_STATES.intro);
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

    adventureStateMachine.changeState(ADVENTURE_STATES.describe_quest);
}

//Before each quest - describe what lies ahead
function doQuestIntro()
{
    clearLog();
    log("I'm heading out to my first quest in the goblin cave.");
    log("I'm a bit nervous. Do you have anything that might help soothe my nerves?");

    adventureStateMachine.changeState(ADVENTURE_STATES.cooking);
}

function giveFoodToAdventurer()
{
    let testFood = {
        name: "Beef Stew",
        atk_bonus: 1
    };

    currentAdventurer.setFood(testFood);
    log("You gave " + testFood.name + " to " + currentAdventurer.name);
    updateAdventurerStatBox();

    adventureStateMachine.changeState(ADVENTURE_STATES.quest_recap);
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