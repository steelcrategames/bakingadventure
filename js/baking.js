class Inventory 
{
    constructor()
    {
        this.Ingredients = new Map();
    }

    hasIngredient(ingredient)
    {
        return this.Ingredients.has(ingredient);
    }

    addIngredient(ingredient, quantity)
    {
        if(!this.hasIngredient(ingredient))
        {
            this.Ingredients.set(ingredient, quantity);
        }
        else
        {
            var q = this.Ingredients.get(ingredient) + quantity;
            if(q < 0)
                q = 0;
            this.Ingredients.set(ingredient, q);
        }
    }

    removeIngredient(ingredient, quantity)
    {
        this.addIngredient(ingredient, -quantity);
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

function loadInventory(container)
{
    var inventory = new Inventory();
    inventory.addIngredient(new Ingredient("Eggs"), 1);
    inventory.addIngredient(new Ingredient("Flour"), 1);
    inventory.addIngredient(new Ingredient("Salt"), 1);
    inventory.addIngredient(new Ingredient("Sugar"), 1);

    inventory.Ingredients.forEach(element => {
        
    });
    container.append("<div>" + "</div>");
}