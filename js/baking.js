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

function loadInventory(container)
{
    inventory = new Inventory();
    inventory.addIngredient(new Ingredient("Eggs"), 1);
    inventory.addIngredient(new Ingredient("Flour"), 1);
    inventory.addIngredient(new Ingredient("Salt"), 1);
    inventory.addIngredient(new Ingredient("Sugar"), 1);

    inventory.IngredientAmounts.forEach((value, key) => {
        var id = key.name;
        var item = document.createElement("div");
        item.setAttribute("id", id);
        item.setAttribute("class", "inventory-item");
        item.innerText = key.name;
        $(item).click(function() {
            if(selected.indexOf(item.id) > -1)
            {
                selected.splice(selected.indexOf(item.id), 1);
                item.style.backgroundColor = "#FFFFFF";
            }
            else
            {
                selected.push(item.id);
                item.style.backgroundColor = "#2F4F4F";
            }
          });
        container.append(item);
    });
    
}

$( document ).ready(function() {
    loadInventory($("#ingredients"));
});