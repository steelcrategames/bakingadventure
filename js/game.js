let screens = ["screen-visitor", "screen-dialogue"]; // TODO: replace this with a find all with class
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

function setupScreens()
{
    showView("screen-visitor", screens);
}
window.onload = setupScreens;

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