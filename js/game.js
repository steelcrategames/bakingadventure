let screens = ["screen-visitor", "screen-dialogue", "baking"]; // TODO: replace this with a find all with class
let dialogViews = ["dialogue-first-visit1", "dialogue-heading-out", "dialogue-return-visit1"]; // TODO: replace this with a find all with class

function talkToAdventurerFirstVisit()
{
    showView("screen-dialogue", screens);
    showView("dialogue-first-visit1", dialogViews);
}

function dialogHeadingOut()
{
    showView("screen-dialogue", screens);
    showView("dialogue-heading-out", dialogViews);
}

function talkToAdventurerReturnVisit()
{
    showView("screen-dialogue", screens);
    showView("dialogue-return-visit1", dialogViews);
}

function startBaking()
{
    showView("baking", screens);
    loadBakingScreen();
}

function bakingComplete()
{
    talkToAdventurerReturnVisit();
}

function setupScreens()
{
    loadScreen("screen-visitor.html", function() {
        loadScreen("screen-dialogue.html", function() {
            loadScreen("baking.html", function() {
                showView("screen-visitor", screens);
            });
        });
    });
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