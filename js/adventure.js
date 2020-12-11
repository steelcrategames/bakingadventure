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
        onEnter: doHeroIntro
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

const HEROS_PER_DAY = 1;
var day = 0;
var heros = [];
var currentHero = {};
var currentHeroIndex = 0;
var adventureStateMachine = new StateMachine(ADVENTURE_STATES);


function loadAdventureScreen()
{
    adventureStateMachine.changeState(ADVENTURE_STATES.new_day);
}


//====================================
// New Day state
//====================================
// Update the day. Create heros if none exist.
function startNewDay()
{
    hideAllButtons();

    day += 1;
    document.getElementById("dayDisplay").innerText = "Day " + day;

    if (heros == null || heros.length == 0)
    {
        for (let i = 0; i < HEROS_PER_DAY; i++) {
            heros.push(createRandomHero());
        }

        console.log(`Created ${heros.length} heros.`);
    }

    currentHeroIndex = 0;
    
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

    if (currentHeroIndex < heros.length)
    {
        showButton("greetHeroButton");
    }
    else
    {
        showButton("endDayButton");
    }
}

function greetHero()
{
    currentHero = heros[currentHeroIndex];

    if (!currentHero.has_done_intro)
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
    hideButton("greetHeroButton");
    hideButton("endDayButton");
}



//====================================
// Intro state
//====================================
//First meeting of a hero - do an introduction
function doHeroIntro() 
{
    updateHeroStatBox();

    clearLog();
    log(`${currentHero.name} enters the restaurant.`);
    log("Hi, I'm " + currentHero.name);
    log("I just moved into the area and heard about a great restaurant. People say it's the place to go for new adventurers!");
    log("I just bought my first armor and am really excited to go on a quest.");

    currentHero.has_done_intro = true;

    adventureStateMachine.changeState(ADVENTURE_STATES.describe_quest);
}

//====================================
// Quest recap state
//====================================
// Recap how yesterday's quest went, taking into consideration the food that was cooked
function doQuestRecap()
{
    updateHeroStatBox();
    clearLog();
    log(`Hello again! It's me ${currentHero.name} from yesterday.`);
    if (currentHero.food != null)
    {
        log(`You gave me ${currentHero.food.name} to help me on my quest.`);
    }
    else
    {
        log(`You didn't give me any food for my quest!`);
    }

    let success = simulateQuest(currentHero);

    if (success)
    {
        log("I successfully completed my quest!", LOG_TYPES.GOOD);
    }
    else
    {
        log("I failed my quest!", LOG_TYPES.BAD);
    }

    //Handle outcome of quest
    currentHero.finishQuest();
    currentHero.food = null;

    updateHeroStatBox();

    adventureStateMachine.changeState(ADVENTURE_STATES.describe_quest);
}


//====================================
// Describe Quest state
//====================================
//Before each quest - describe what lies ahead
function doDescribeQuest()
{
    clearLog();

    //Choose a new quest for the adventurer
    currentHero.setQuest(createRandomQuest());
    let quest = currentHero.current_quest;

    if (currentHero.completed_quests.length == 0)
    {
        log(`I'm heading out to my first quest: ${quest.name}`);
    }
    else
    {
        log(`I'm heading out to my next quest: ${quest.name}`);
    }
    
    log(`It's a level ${quest.level} quest and I expect to find a ${quest.enemy.name} or two. Do you have anything that might help soothe my nerves?`);

    adventureStateMachine.changeState(ADVENTURE_STATES.active_customer);
}



//====================================
// Active customer state
//====================================
// Cook for a customer, or send them on their way
function enterActiveCustomerState()
{
    showButton("giveFoodToHeroButton");
    showButton("waveByeButton");
}

function giveFoodToHero()
{
    startBaking();

    let testFood = {
        name: "Beef Stew",
        atk_bonus: 1
    };

    currentHero.setFood(testFood);
    log("You gave " + testFood.name + " to " + currentHero.name);
    updateHeroStatBox();
    log(`${currentHero.name}: Thanks!`);

    //TODO: consider appetite and decide how much food you can make for a hero
    if (currentHero.food != null)
    {
        hideButton("giveFoodToHeroButton");
    }
}

function waveBye()
{
    currentHero = null;
    currentHeroIndex += 1;
    updateHeroStatBox();
    adventureStateMachine.changeState(ADVENTURE_STATES.empty_restaurant);
}

function exitActiveCustomerState()
{
    hideButton("giveFoodToHeroButton");
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
    log("What a lovely day. I hope those heros do well on their quests.");
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
// Hero stuff
//=========================
function updateHeroStatBox()
{
    if (currentHero == null)
    {
        document.getElementById("heroStatBox").style.display = "none";
    }
    else
    {
        document.getElementById("heroStatBox").style.display = "block";

        document.getElementById("heroName").innerText = currentHero.name;
        document.getElementById("heroTitle").innerText = currentHero.title;
        document.getElementById("heroQuote").innerText = currentHero.quote;
        document.getElementById("heroSTR").innerText = currentHero.stats.str;
        document.getElementById("heroDEX").innerText = currentHero.stats.dex;
        document.getElementById("heroCON").innerText = currentHero.stats.con;
        document.getElementById("heroINT").innerText = currentHero.stats.int;
        document.getElementById("heroWIS").innerText = currentHero.stats.wis;
        document.getElementById("heroCHR").innerText = currentHero.stats.chr;
        document.getElementById("heroHP").innerText = currentHero.stats.max_hp;
        document.getElementById("heroAppetite").innerText = currentHero.stats.appetite;

        if (currentHero.food != null)
        {
            document.getElementById("heroFood").innerText = currentHero.food.name;
        }
        else
        {
            document.getElementById("heroFood").innerText = "none";
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