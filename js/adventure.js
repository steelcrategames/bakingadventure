const LogTypes = {
    GOOD: "bg-success",
    INFO: "bg-info",
    DEFAULT: "",
    WARN: "bg-warning",
    BAD: "bg-danger",
    ACTION: "log-action"
};
Object.freeze(LogTypes);

const ADVENTURE_STATES = {
    new_day:
    {
        onEnter: startNewDay
    },

    empty_bakery: 
    {
        onEnter: enterEmptyBakeryState,
        onExit: exitEmptyBakeryState
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
        onEnter: enterDescribeQuestState,
        onExit: exitDescribeQuestState
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

var day = 0;
var heros = [];
var currentHero = {};
var currentHeroIndex = 0;
var adventureStateMachine = new StateMachine(ADVENTURE_STATES);
var questGenerator = new QuestGenerator();


function loadAdventureScreen(numHeroes)
{
    generateHeroes(numHeroes);
    adventureStateMachine.changeState(ADVENTURE_STATES.new_day);
}

function generateHeroes(numHeroes)
{
    heros = [];
    for (let i = 0; i < numHeroes; i++) 
    {
        heros.push(createRandomHero());
    }

    console.log(`Created ${heros.length} heros.`);
}


//====================================
// New Day state
//====================================
// Update the day. Create heros if none exist.
function startNewDay()
{
    showView(SCREENS.dayTitle, screens);
    hideAllButtons();

    day += 1;
    $("[id=dayDisplay]").text("Day " + day);

    currentHeroIndex = 0;

    bakery.handleNewDay();
}

function openBakery()
{    
    adventureStateMachine.changeState(ADVENTURE_STATES.empty_bakery);
}

//====================================
// Empty Bakery state
//====================================
// Waiting for a customer, if there are any left today. Otherwise, closing up shop for the day!
function enterEmptyBakeryState()
{
    showView(SCREENS.screenVisitor, screens);

    hideAllButtons();
    clearLog();

    let remainingHeroCount = heros.length - currentHeroIndex;
    let heroesOutsideCount = remainingHeroCount - 1;
    let bakeryMsg = "";
    let bakerySubMsg = "";

    if (heroesOutsideCount > 1)
    {
        //Many heroes waiting outside
        bakeryMsg = "A hero approaches!";
        bakerySubMsg = `There are also ${heroesOutsideCount} heroes waiting outside.`;
        document.getElementById("hero-img").style.display = "";
    }
    else if (heroesOutsideCount == 1)
    {
        //Just one more hero after the current hero
        bakeryMsg = "A hero approaches!";
        bakerySubMsg = "There is also one more hero waiting outside.";
        document.getElementById("hero-img").style.display = "";
    }
    else if (remainingHeroCount == 1)
    {
        //Last customer is in the bakery
        bakeryMsg = "A hero approaches!"
        bakerySubMsg = "There are no more customers outside";
        document.getElementById("hero-img").style.display = "";
    }
    else
    {
        //No heroes left at all
        bakeryMsg = "The bakery is empty"
        bakerySubMsg = "There are no more customers outside";
        document.getElementById("hero-img").style.display = "none";
    }

    document.getElementById("bakeryMessage").innerText = bakeryMsg;
    //document.getElementById("bakerySubMessage").innerText = bakerySubMsg;

    if (currentHeroIndex < heros.length)
    {
        showButton("greetHeroButton");
        hideButton("endDayButton");
    }
    else
    {
        showButton("endDayButton");
        hideButton("greetHeroButton");
    }
}

function greetHero()
{
    showView(SCREENS.adventure, screens);
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

function exitEmptyBakeryState()
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
    log(`${currentHero.name} enters the restaurant.`, LogTypes.ACTION);
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
    let quest = currentHero.current_quest;

    updateHeroStatBox();
    clearLog();
    log(`Hello again! It's me ${currentHero.name} from yesterday.`);
    if (currentHero.stats.food.length > 0)
    {
        let foodList = currentHero.stats.food.map(food => food.getHTML()).join(", ");
        log(`You gave me ${foodList} to help me on my quest to ${quest.name}.`);
    }
    else
    {
        log(`You didn't give me any food for my quest to ${quest.name}!`);
    }

    simulateQuest(currentHero);

    //Print out the battle log, for now
    clearCombatLog();
    combatLog(`Quest: ${quest.name} Level: ${quest.level} Enemy: ${quest.enemyTemplate.name} Stats: ${quest.enemyTemplate.stats.to_string()}`);
    currentHero.current_quest.log.forEach(msg => {
        combatLog(msg);
    });

    showButton("showCombatLogButton");

    if (currentHero.current_quest.result == QuestResult.SUCCESS)
    {
        log("I successfully completed my quest!", LogTypes.GOOD);
    }
    else
    {
        log("I failed my quest!", LogTypes.BAD);
    }

    //Handle outcome of quest
    currentHero.finishQuest();

    updateHeroStatBox();

    adventureStateMachine.changeState(ADVENTURE_STATES.describe_quest);
}

function clearCombatLog()
{
    var log = document.getElementById("combatLog");
    log.innerHTML = '';
}

function combatLog(msg)
{
    var log = document.getElementById("combatLog");
    var logMsg = document.createElement("p");
    var span = document.createElement("span");
    span.appendChild(document.createTextNode(msg));
    logMsg.appendChild(span);
    log.appendChild(logMsg);
}


//====================================
// Describe Quest state
//====================================
//Before each quest - describe what lies ahead

function enterDescribeQuestState()
{
    showButton("doDescribeQuestButton");
}

function doDescribeQuest()
{
    clearLog();

    //Choose a new quest for the adventurer
    let level = currentHero.getSuccessfulQuestCount() + 1;
    let nextQuest = questGenerator.createRandomQuest(level);
    currentHero.setQuest(nextQuest);
    let quest = currentHero.current_quest;

    if (currentHero.completed_quests.length == 0)
    {
        log(`I'm heading out to my first quest: ${quest.name}`);
    }
    else
    {
        log(`I'm heading out to my next quest: ${quest.name}`);
    }
    
    log(`It's a level ${quest.actual_level} quest and I expect to find a ${quest.enemyTemplate.getHTML()} or two. Do you have anything that might help soothe my nerves?`);

    adventureStateMachine.changeState(ADVENTURE_STATES.active_customer);
}

function exitDescribeQuestState()
{
    hideButton("showCombatLogButton");
    hideButton("doDescribeQuestButton");
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
    //Kick off the baking flow
    //Relies on "onFinishBaking" to be called afterwards to resume the conversation
    startBaking();
}

function onFinishBaking(food)
{
    currentHero.addFood(food);
    log("You gave " + food.getHTML() + " to " + currentHero.name, LogTypes.ACTION);


    updateHeroStatBox();
    log(`Thanks!`);

    if (currentHero.stats.food.length >= currentHero.stats.appetite)
    {
        log("Gosh that's plenty for me! I don't think I'd be able to eat anything else on my quest.");
        hideButton("giveFoodToHeroButton");
    }
}

function waveBye()
{
    currentHero = null;
    currentHeroIndex += 1;
    updateHeroStatBox();
    adventureStateMachine.changeState(ADVENTURE_STATES.empty_bakery);
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
    showView(SCREENS.adventure, screens);
    showButton("startNextDayButton");
}

function doEndDay()
{
    adventureStateMachine.changeState(ADVENTURE_STATES.end_of_day);
    clearLog();
    log("What a lovely day. I hope those heroes do well on their quests.");
}

function doStartNextDay()
{
    adventureStateMachine.changeState(ADVENTURE_STATES.new_day);
    showView(SCREENS.dayTitle, screens);
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
        document.getElementById("heroHP").innerText = currentHero.stats.max_hp;
        document.getElementById("heroATK").innerText = currentHero.stats.getAtk_string();
        document.getElementById("heroHitChance").innerText = `${currentHero.stats.base_hitChance}%`;
        document.getElementById("heroDEF").innerText = currentHero.stats.getDef_string();
        document.getElementById("heroAppetite").innerText = currentHero.stats.appetite;

        document.getElementById("heroFood").innerHTML = '';
        if (currentHero.stats.food.length > 0)
        {
            currentHero.stats.food.forEach(food => {
                let item = document.createElement("li");
                item.innerHTML = food.getHTML();
                document.getElementById("heroFood").appendChild(item);
            });
        }
        else
        {
            var item = document.createElement("li");    
            item.appendChild(document.createTextNode("None"));
            document.getElementById("heroFood").appendChild(item);
        }
    }

    $('[data-toggle="tooltip"]').tooltip();
}


//====================================
// Utility stuff
//=========================
function log(msg, type)
{
    var log = document.getElementById("log");
    var logMsg = document.createElement("p");
    logMsg.classList.add(type);
    logMsg.innerHTML = msg;
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
    document.getElementById(buttonName).style.display = "";
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