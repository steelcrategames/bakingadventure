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
    constructor(name)
    {
        this.name = name;
    }
}

class BakedGood
{
    constructor(name)
    {
        this.name = name;
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
        inventory.addIngredient(new Ingredient(dataCSV[i]["Name"]), 1);
    }
}

function loadInventory(container, data)
{
    loadIngredients(data);

    inventory.IngredientAmounts.forEach((value, key) => {
        var id = key.name;
        var item = document.createElement("div");
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

$( document ).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/ingredients.csv",
        dataType: "text",
        success: function(data) {loadInventory($("#ingredients"), data);}
     });
    
});