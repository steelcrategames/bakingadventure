const LOG_TYPES = {
    GOOD: "bg-success",
    INFO: "bg-info",
    DEFAULT: "",
    WARN: "bg-warning",
    BAD: "bg-danger"
}

const ADVENTURE_STATES = {
    new_day:
    {
        onEnter: startNewDay
    },

    empty_restaurant: 
    {
        onEnter: enterEmptyRestaurantState,
        onExit: exitEmptyRestaurantState
    },

    intro: 
    {
        onEnter: doAdventurerIntro
    },

    quest_recap: 
    {
        onEnter: doQuestRecap
    },

    describe_quest: 
    {
        onEnter: () => showButton("doDescribeQuestButton"),
        onExit: () => hideButton("doDescribeQuestButton")
    },

    active_customer:
    {
        onEnter: enterActiveCustomerState,
        onExit: exitActiveCustomerState
    },

    end_of_day:
    {
        onEnter: enterEndOfDayState,
        onExit: exitEndOfDayState
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

        this.has_done_intro = false;
        this.num_quests_completed = 0;
    }

    setFood(food)
    {
        this.food = food;
    }
}

const ADVENTURERS_PER_DAY = 2;
var day = 0;
var adventurers = [];
var currentAdventurer = {};
var currentAdventurerIndex = 0;
var adventureStateMachine = new StateMachine(ADVENTURE_STATES);


function loadAdventureScreen()
{
    adventureStateMachine.changeState(ADVENTURE_STATES.new_day);
}


//====================================
// New Day state
//====================================
// Update the day. Create adventurers if none exist.
function startNewDay()
{
    hideAllButtons();

    day += 1;
    document.getElementById("dayDisplay").innerText = "Day " + day;

    if (adventurers == null || adventurers.length == 0)
    {
        for (let i = 0; i < ADVENTURERS_PER_DAY; i++) {
            adventurers.push(createRandomAdventurer());
        }

        console.log(`Created ${adventurers.length} adventurers.`);
    }

    currentAdventurerIndex = 0;
    
    adventureStateMachine.changeState(ADVENTURE_STATES.empty_restaurant);
}

//====================================
// Empty Restaurant state
//====================================
// Waiting for a customer, if there are any left today. Otherwise, closing up shop for the day!
function enterEmptyRestaurantState()
{
    hideAllButtons();
    clearLog();
    log("The restaurant is empty");

    if (currentAdventurerIndex < adventurers.length)
    {
        showButton("greetAdventurerButton");
    }
    else
    {
        showButton("endDayButton");
    }
}

function greetAdventurer()
{
    currentAdventurer = adventurers[currentAdventurerIndex];

    if (!currentAdventurer.has_done_intro)
    {
        adventureStateMachine.changeState(ADVENTURE_STATES.intro);
    }
    else
    {
        adventureStateMachine.changeState(ADVENTURE_STATES.quest_recap);
    }
}

function exitEmptyRestaurantState()
{
    hideButton("greetAdventurerButton");
    hideButton("endDayButton");
}



//====================================
// Intro state
//====================================
//First meeting of an adventurer - do an introduction
function doAdventurerIntro() 
{
    updateAdventurerStatBox();

    clearLog();
    log(`${currentAdventurer.name} enters the restaurant.`);
    log("Hi, I'm " + currentAdventurer.name);
    log("I just moved into the area and heard about a great restaurant. People say it's the place to go for new adventurers!");
    log("I just bought my first armor and am really excited to go on a quest.");

    currentAdventurer.has_done_intro = true;

    adventureStateMachine.changeState(ADVENTURE_STATES.describe_quest);
}

//====================================
// Quest recap state
//====================================
// Recap how yesterday's quest went, taking into consideration the food that was cooked
function doQuestRecap()
{
    updateAdventurerStatBox();
    clearLog();
    log(`Hello again! It's me ${currentAdventurer.name} from yesterday.`);
    if (currentAdventurer.food != null)
    {
        log(`You gave me ${currentAdventurer.food.name} to help me on my quest.`);
    }
    else
    {
        log(`You didn't give me any food for my quest!`);
    }

    log("I just returned from the goblin lair. Even the entrance was scary but I was strangely calm.", LOG_TYPES.INFO);
    log("On the first level, I was attacked by two goblins but kept my wits and managed to press on.");

    if (currentAdventurer.food == null)
    {
        log("On the second level, I was poisoned and started to feel really sick so I had to escape.", LOG_TYPES.BAD);
        log("I did not complete my quest.", LOG_TYPES.BAD);
    }
    else
    {
        log("On the second level, I was poisoned and started to feel really sick. But then I ate my " + currentAdventurer.food.name + " and I felt great!", LOG_TYPES.GOOD);
        log("I defeated the last of the goblins and found the treasure.", LOG_TYPES.GOOD);
        log("I successfully completed my quest!", LOG_TYPES.GOOD);
    }

    //Handle outcome of quest
    currentAdventurer.num_quests_completed += 1;
    currentAdventurer.food = null;

    updateAdventurerStatBox();

    adventureStateMachine.changeState(ADVENTURE_STATES.describe_quest);
}


//====================================
// Describe Quest state
//====================================
//Before each quest - describe what lies ahead
function doDescribeQuest()
{
    clearLog();
    if (currentAdventurer.num_quests_completed == 0)
    {
        log("I'm heading out to my first quest in the goblin cave.");
    }
    else
    {
        log("I'm heading out to my next quest in another goblin cave.");
    }
    
    log("I'm a bit nervous. Do you have anything that might help soothe my nerves?");

    adventureStateMachine.changeState(ADVENTURE_STATES.active_customer);
}



//====================================
// Active customer state
//====================================
// Cook for a customer, or send them on their way
function enterActiveCustomerState()
{
    showButton("giveFoodToAdventurerButton");
    showButton("waveByeButton");
}

function giveFoodToAdventurer()
{
    startBaking();

    let testFood = {
        name: "Beef Stew",
        atk_bonus: 1
    };

    currentAdventurer.setFood(testFood);
    log("You gave " + testFood.name + " to " + currentAdventurer.name);
    updateAdventurerStatBox();
    log(`${currentAdventurer.name}: Thanks!`);

    //TODO: consider appetite and decide how much food you can make for an adventurer
    if (currentAdventurer.food != null)
    {
        hideButton("giveFoodToAdventurerButton");
    }
}

function waveBye()
{
    currentAdventurer = null;
    currentAdventurerIndex += 1;
    updateAdventurerStatBox();
    adventureStateMachine.changeState(ADVENTURE_STATES.empty_restaurant);
}

function exitActiveCustomerState()
{
    hideButton("giveFoodToAdventurerButton");
    hideButton("waveByeButton");
}


//====================================
// End of Day state
//=========================
// No more customers left
function enterEndOfDayState()
{
    showButton("startNextDayButton");
}

function doEndDay()
{
    adventureStateMachine.changeState(ADVENTURE_STATES.end_of_day);
    clearLog();
    log("What a lovely day. I hope those adventurers do well on their quests.");
}

function doStartNextDay()
{
    adventureStateMachine.changeState(ADVENTURE_STATES.new_day);
}

function exitEndOfDayState()
{
    hideButton("waveByeButton");
}



//====================================
// Adventurer stuff
//=========================
function createRandomAdventurer()
{
    const appetites = [ "small", "medium", "large" ];
    const skillLevels = [ "Novice", "Apprentice", "Experienced", "Savvy" ];
    const titles = [ "Knight", "Squire", "Bard", "Adventurer", "Farmer" ];

    let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + "immy";
    let title = "the " + skillLevels[Math.floor(Math.random() * skillLevels.length)] + " " + titles[Math.floor(Math.random() * titles.length)];
    let quote = name + "'s the name and adventuring is my game!";

    let appetite = appetites[Math.floor(Math.random() * appetites.length)];

    return new Adventurer(name, title, quote, appetite);
}

function updateAdventurerStatBox()
{
    if (currentAdventurer == null)
    {
        document.getElementById("adventurerStatBox").style.display = "none";
    }
    else
    {
        document.getElementById("adventurerStatBox").style.display = "block";

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
}


//====================================
// Utility stuff
//=========================
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

function hideAllButtons()
{
    var elements = document.getElementsByClassName("adv-btn")

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
}