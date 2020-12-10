let screens = ["screen-visitor", "screen-dialog-adventurer"]; // TODO: replace this with a find all with class
let dialogViews = ["dialog-first-visit1", "dialog-heading-out", "dialog-return-visit1"]; // TODO: replace this with a find all with class

function talkToAdventurerFirstVisit()
{
    showView("screen-dialog-adventurer", screens);
    showView("dialog-first-visit1", dialogViews);
}

function dialogHeadingOut()
{
    showView("screen-dialog-adventurer", screens);
    showView("dialog-heading-out", dialogViews);
}

function talkToAdventurerReturnVisit()
{
    showView("screen-dialog-adventurer", screens);
    showView("dialog-return-visit1", dialogViews);
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