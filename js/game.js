$.ajaxSetup ({
    // Disable caching of AJAX responses, important for screen loading
    cache: false
});

const SCREENS = {
    screenVisitor : "screen-visitor",
    screenDialog : "screen-dialogue",
    baking: "baking",
    adventure: "adventure",
    prologue: "screen-prologue",
    dayTitle: "screen-day-title",
    heroCount: "hero-choice"
}
let screens = [SCREENS.screenVisitor, SCREENS.screenDialog, SCREENS.baking, SCREENS.adventure, SCREENS.prologue, SCREENS.dayTitle, SCREENS.heroCount];

let dialogViews = ["dialogue-first-visit1", "dialogue-heading-out", "dialogue-return-visit1"]; // TODO: replace this with a find all with class

function talkToAdventurerFirstVisit()
{
    showView(SCREENS.screenDialog, screens);
    showView("dialogue-first-visit1", dialogViews);
}

function dialogHeadingOut()
{
    showView(SCREENS.screenDialog, screens);
    showView("dialogue-heading-out", dialogViews);
}

function talkToAdventurerReturnVisit()
{
    showView(SCREENS.screenDialog, screens);
    showView("dialogue-return-visit1", dialogViews);
}

function startNewGame(numHeroes)
{
    loadAdventureScreen(numHeroes);
}

function startBaking()
{
    showView(SCREENS.baking, screens);
    bakery.loadBakingScreen();
}

function showHeroCountScreen()
{
    showView(SCREENS.heroCount, screens);
}

function showDayTitleScreen()
{
    showView(SCREENS.dayTitle, screens);
}

function showVisitorScreen()
{
    showView(SCREENS.screenVisitor, screens);
}

function bakingComplete()
{
    showView(SCREENS.adventure, screens);
}

function setupScreens()
{
    const numHeroes = 1; //TODO: add a screen to select how many heroes to use

    loadScreen("screen-visitor.html", function() {
        loadScreen("screen-dialogue.html", function() {
            loadScreen("baking.html", function() {
                loadScreen("adventure.html", function() {
                    loadScreen("screen-prologue.html", function() {
                        loadScreen("hero_choice.html", function() {
                            loadScreen("screen-day-title.html", function() {
                                showView(SCREENS.prologue, screens);
                            });
                        });
                    });
                });
            });
        });
    });

    $('[data-toggle="tooltip"]').tooltip();
}
window.onload = setupScreens;

function loadScreen(screenFile, callback)
{
    $("#body").append($("<div>").load(screenFile, callback));
}

function showView(viewID, viewList)
{
    viewList.forEach(view => {
        if (view == viewID)
        {
            document.getElementById(view).style.display = "block";
        }
        else
        {
            document.getElementById(view).style.display = "none";
        }
    });
}