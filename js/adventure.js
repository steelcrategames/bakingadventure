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
    combatLog(`Quest: ${quest.name} Level: ${quest.actual_level} Enemy: ${quest.enemyTemplate.name}`);
    combatLog(`${quest.enemyTemplate.name} Stats: ${quest.enemyTemplate.stats.to_string()}`);
    combatLog(`${currentHero.name} base stats: ${currentHero.stats.to_string(false)}`);
    combatLog(`${currentHero.name} stats w/ food: ${currentHero.stats.to_string(true)}`);
    currentHero.current_quest.log.forEach(msg => {
        combatLog(msg);
    });

    showButton("showCombatLogButton");

    let stats = quest.stats;

    if (stats.hero.misses == 0)
    {
        log("My blade struck true with every swing.");
    }
    else if (stats.hero.hits == 0)
    {
        log("I never landed a single blow!");
    }

    if (stats.hero.hits > 5)
    {
        log(`I hacked and hacked and hacked away at the ${quest.enemyTemplate.name}.`);
    }

    if (stats.hero.hits > 0)
    {
        let dmgTotal = stats.enemy.getDmgTakenTotal();
        let dmgPerHit = dmgTotal / stats.hero.hits;

        if (stats.enemy.dmg_blocked["physical"] > 10)
        {
            log("My blows landed only with a dull thud, garnering less reaction than I expected.");
        }
        else if (stats.enemy.dmg_taken["physical"] > 10)
        {
            log(`I rained down heavy blows with all my might.`);
        }

        if (stats.enemy.dmg_blocked["fire"] > 10)
        {
            log(`Flames seemed to do little to disturb the ${quest.enemyTemplate.name}.`);
        }
        else if (stats.enemy.dmg_taken["fire"] > 10)
        {
            log(`My flames scorched and sharred the beast.`);
        }

        if (stats.enemy.dmg_blocked["ice"] > 10)
        {
            log(`If ice bothers the ${quest.enemyTemplate.name}, it does not show it.`);
        }
        else if (stats.enemy.dmg_taken["ice"] > 10)
        {
            log(`The beast was chilled to its very core!`);
        }

        if (dmgTotal == 0)
        {
            log(`My blows seemed to have no effect whatsoever!`);
        }
        else if (dmgPerHit <= 2)
        {
            log(`Each strike seemed to do little to phase the ${quest.enemyTemplate.name}.`);
        }
    }

    if (stats.enemy.hits > 0)
    {
        if (stats.hero.getDmgTakenTotal() == 0)
        {
            log(`The ${quest.enemyTemplate.name}'s strikes could not break my defences.`);
        }

        if (stats.hero.dmg_taken["physical"] > 5)
        {
            log(`Each strike from the ${quest.enemyTemplate.name} felt like a thousand hammers.`);
        }
        else if (stats.hero.dmg_blocked["physical"] > 5)
        {
            log("My armor helped shield me from the blows.");
        }
        
        if (stats.hero.dmg_taken["fire"] > 5)
        {
            log(`The scorching heat of the ${quest.enemyTemplate.name}'s attacks left me seared and charred.`);
        }
        else if (stats.hero.dmg_blocked["fire"] > 5)
        {
            log("I felt an odd calm as the flames washed over me, warming my face.");
        }

        if (stats.hero.dmg_taken["ice"] > 5)
        {
            log(`The ${quest.enemyTemplate.name}'s attacks chilled me to my core.`);
        }
        else if (stats.hero.dmg_blocked["ice"] > 5)
        {
            log("I felt an odd calm as the frost washed over me, cooling my face.");
        }
    }

    if (stats.enemy.misses > 0 && stats.enemy.hits == 0)
    {
        log(`The ${quest.enemyTemplate.name} flailed wildly but could not land a single blow.`);
    }


    if (currentHero.current_quest.result == QuestResult.SUCCESS)
    {
        if (stats.hero.getDmgTakenTotal() > currentHero.max_hp)
        {
            //Would have died if not for HP bonuses
            log("I didn't think I would be able to survive, but the baked goods provided me with the endurance I needed!");
        }

        if (stats.num_rounds > 10)
        {
            log("Eventually, I persevered!");
        }

        if (stats.hero.getDmgTakenTotal() == 0)
        {
            log("I escaped with nary a scratch.");
        }
        else if (currentHero.stats.getMaxHP() - stats.hero.getDmgTakenTotal() < 5)
        {
            log("I was lucky to escape with my life.");
        }

        log("I successfully completed my quest!", LogTypes.GOOD);
    }
    else
    {

        let enemyHP = quest.enemyTemplate.stats.getMaxHP();
        let enemyHPLeft = enemyHP - stats.enemy.getDmgTakenTotal();
        let percentHPLeft = enemyHPLeft / enemyHP;

        if (percentHPLeft > 0.75)
        {
            log(`The ${quest.enemyTemplate.name} barely seemed to break a sweat.`);
        }
        else if (percentHPLeft < 0.35)
        {
            log(`I know I had the ${quest.enemyTemplate.name} on the ropes, but I just couldn't finish the fight.`);
        }

        if (stats.enemy.hits <= 2)
        {
            log(`The ${quest.enemyTemplate.name} struck with such ferocity I could not withstand the punishment.`);
        }

        if (stats.num_rounds == 100)
        {
            log("It was an epic battle back and forth, but eventually I became exhausted and had to retreat.");
        }

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
    
    log(`It's a level ${quest.actual_level} quest and I expect to find a ${quest.enemyTemplate.getHTML()} or two. Do you have anything that could help me on my quest?`);

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