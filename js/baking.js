class Inventory 
{
    constructor()
    {
        this.Ingredients = new Map();
        this.IngredientAmounts = new Map();
    }

    hasIngredient(ingredient)
    {
        return this.IngredientAmounts.has(ingredient);
    }

    addIngredient(ingredient, quantity)
    {
        if(!this.hasIngredient(ingredient))
        {
            this.IngredientAmounts.set(ingredient, quantity);
            this.Ingredients.set(ingredient.name, ingredient);
        }
        else
        {
            var q = this.IngredientAmounts.get(ingredient) + quantity;
            if(q < 0)
                q = 0;
            this.IngredientAmounts.set(ingredient, q);
        }
    }

    removeIngredient(ingredient, quantity)
    {
        this.addIngredient(ingredient, -quantity);
    }

    getIngredient(name)
    {
        return this.Ingredients.get(name);
    }
}

class Ingredient 
{
    constructor(name, effects)
    {
        this.name = name;
        this.effects = effects;
    }
}

class Effect
{
    constructor(type, amount)
    {
        this.type = type;
        this.amount = amount;
    }
}

var inventory;
var selected = new Array();

function loadIngredients(data)
{
    inventory = new Inventory();

    var dataCSV = $.csv.toObjects(data);
    for(var i=0; i < dataCSV.length; i++)
    {
        var effects = [];
        for(var j = 1; j < 5; j++)
        {
            if(dataCSV[i]["Effect" + j]  != "")
            {
                effects.push(new Effect(dataCSV[i]["Effect" + j], dataCSV[i]["Effect" + j + "Amount"]));
            }
        }

        inventory.addIngredient(new Ingredient(dataCSV[i]["Name"], effects), 1);
    }
}

function loadInventory(container, data)
{
    selected = [];
    container.empty();
    loadIngredients(data);

    inventory.IngredientAmounts.forEach((value, key) => {
        var id = key.name;
        var item = document.createElement("div");
        item.setAttribute("data-toggle","tooltip");
        item.setAttribute("data-placement", "top");
        item.setAttribute("data-html", "true");
        item.setAttribute("title", getDescriptionHTML(key));
        item.setAttribute("id", id);
        item.setAttribute("class", "p-4 inventory-item");
        item.append(document.createElement("p").innerText = key.name);
        item.append(document.createElement("br"));
        item.append(document.createElement("p").innerText = value);
        $(item).click(function() {
            if(selected.indexOf(item.id) > -1)
            {
                selected.splice(selected.indexOf(item.id), 1);
                item.style.backgroundColor = "#FFFFFF";
            }
            else if (selected.length < 4)
            {
                selected.push(item.id);
                item.style.backgroundColor = "#2F4F4F";
            }
          });
        container.append(item);
    });
}

function getDescriptionHTML(ingredient)
{
    var description = "<em>" + ingredient.name + "</em><br>";
    for(var i = 0; i < ingredient.effects.length; i++)
    {
        description += "<p>" + ingredient.effects[i].type + " " + ingredient.effects[i].amount + "</p>"
    }
    return description;
}

function getBakeResultHTML(bakedGood)
{
    var result = document.createElement("div");
    var nameText = document.createElement("p").innerText = "You've baked a " + bakedGood.name + "!";
    result.append(nameText);
    return result;
}

function getBakedGood()
{
    var hp_bonus = 0;
    var atk_type_bonus = {};
    var hitChance_bonus = 0;
    var def_type_bonus = {};
    
    for(var i = 0; i < selected.length; i++)
    {
        var ingredient = inventory.getIngredient(selected[i]);
        for(var j = 0; j < ingredient.effects.length; j++)
        {
            var amount = parseFloat(ingredient.effects[j].amount);
            switch(ingredient.effects[j].type)
            {
                case "hp":
                    hp_bonus += amount;
                    break;
                case "atk":
                    atk_type_bonus["physical"] = (atk_type_bonus["physical"] || 0) + amount;
                    break;
                case "cold_atk":
                    atk_type_bonus["cold"] = (atk_type_bonus["cold"] || 0) +amount;
                    break;
                case "def":
                    def_type_bonus["physical"] = (def_type_bonus["physical"] || 0) + amount;
                    break;
                case "cold_def":
                    def_type_bonus["cold"] = (def_type_bonus["cold"] || 0) + amount;
                    break;
                case "hit":
                    hitChance_bonus += amount;
                    break;
            }
        }
    }

    var bakedGood = new Food({ name: "Cake", hp_bonus: hp_bonus, atk_type_bonuses: atk_type_bonus, hitChance_bonus: hitChance_bonus, def_type_bonuses: def_type_bonus });

    return bakedGood;
}

function bake(container)
{
    var bakedGood = getBakedGood();
    container.empty();
    var bakeText = getBakeResultHTML(bakedGood);
    container.append(bakeText);
    container.append(document.createElement("br"))
    var serveButton = document.createElement("button");
    serveButton.innerText = "Serve";
    serveButton.setAttribute("class","btn btn-primary");
    $(serveButton).click(() => serveBakedGood(bakedGood));
    container.append(serveButton);
}

function serveBakedGood(bakedGood)
{
    bakingComplete();
    onFinishBaking(bakedGood);
}

function loadBakingScreen()
{
    $.ajax({
        type: "GET",
        url: "data/ingredients.csv",
        dataType: "text",
        success: function(data) {loadInventory($("#ingredients"), data);}
     });
     $("#bakeResult").empty();
     $("#bakeButton").click(function() { bake($("#bakeResult")) });
}

/*$( document ).ready(function() {

});*/