var MAX_INGREDIENTS = 2;

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
            let q = this.IngredientAmounts.get(ingredient) + quantity;
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

    getAmount(name)
    {
        return this.IngredientAmounts.get(this.Ingredients.get(name));
    }

    receiveStock(amount)
    {
        this.IngredientAmounts.forEach((value, key) => {
            this.addIngredient(key, amount);
        });
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

class Recipe
{
    constructor(name, description, ingredients)
    {
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
    }
}

class Bakery
{
    populateRecipes(data)
    {   
        this.recipes = new Map();
        let dataCSV = $.csv.toObjects(data);
        for(let i=0; i < dataCSV.length; i++)
        {
            let ingredients = [];
            for(let j = 1; j <= MAX_INGREDIENTS; j++)
            {
                if(dataCSV[i]["Ingredient" + j]  != "")
                {
                    ingredients.push(dataCSV[i]["Ingredient" + j]);
                }
            }

            let key = ingredients.sort().join();
            this.recipes.set(key, new Recipe(dataCSV[i].Name, dataCSV[i].Description, ingredients));
        }
    }

    loadIngredients(data)
    {
        this.inventory = new Inventory();

        let dataCSV = $.csv.toObjects(data);
        for(let i=0; i < dataCSV.length; i++)
        {
            let effects = [];
            for(let j = 1; j < 5; j++)
            {
                if(dataCSV[i]["Effect" + j]  != "")
                {
                    effects.push(new Effect(dataCSV[i]["Effect" + j], dataCSV[i]["Effect" + j + "Amount"]));
                }
            }

            this.inventory.addIngredient(new Ingredient(dataCSV[i]["Name"], effects), 0);
        }
    }

    updateItemHTML(name, value, item)
    {
        item.innerHTML = "";
        item.append(document.createElement("p").innerText = name);
        item.append(document.createElement("br"));
        item.append(document.createElement("p").innerText = value);
    }

    loadInventory(data)
    {
        this.selected = [];
        this.loadIngredients(data);
    }

    updateIngredientsContainer(container)
    {
        container.empty();
        this.inventory.IngredientAmounts.forEach((value, key) => {
            let id = key.name;
            let item = document.createElement("div");
            item.setAttribute("data-toggle","tooltip");
            item.setAttribute("data-placement", "top");
            item.setAttribute("data-html", "true");
            item.setAttribute("title", this.getDescriptionHTML(key));
            item.setAttribute("id", id);
            item.setAttribute("class", "p-4 inventory-item");
            this.updateItemHTML(key.name, value, item);
            let bakery = this;
            $(item).click(function() {
                if(bakery.inventory.getAmount(item.id) > 0)
                {
                    if(bakery.selected.indexOf(item.id) > -1)
                    {
                        bakery.selected.splice(selected.indexOf(item.id), 1);
                        item.style.backgroundColor = "";
                    }
                    else if (bakery.selected.length < MAX_INGREDIENTS)
                    {
                        bakery.selected.push(item.id);
                        item.style.backgroundColor = "#2F4F4F";
                    }
                }
            });
            container.append(item);
        });
    }

    getDescriptionHTML(ingredient)
    {
        let description = "<em>" + ingredient.name + "</em><br>";
        for(let i = 0; i < ingredient.effects.length; i++)
        {
            description += "<p>" + ingredient.effects[i].type + " " + ingredient.effects[i].amount + "</p>"
        }
        return description;
    }

    getBakeResultHTML(bakedGood)
    {
        let result = document.createElement("div");
        let nameText = document.createElement("p").innerText = "You've baked a " + bakedGood.name + "!";
        result.append(nameText);
        return result;
    }

    getFoodName()
    {
        let key = this.selected.sort().join();
        if(this.recipes.has(key))
        {
            return this.recipes.get(key).name;
        }
        else
        {
            return "Soggy Mess";
        }
    }

    createFood()
    {
        let hp_bonus = 0;
        let atk_type_bonus = {};
        let hitChance_bonus = 0;
        let def_type_bonus = {};
        
        for(let i = 0; i < this.selected.length; i++)
        {
            let ingredient = this.inventory.getIngredient(this.selected[i]);

            this.inventory.removeIngredient(ingredient, 1);

            for(let j = 0; j < ingredient.effects.length; j++)
            {
                let amount = parseFloat(ingredient.effects[j].amount);

                if (ingredient.effects[j].type.startsWith("atk_"))
                {
                    let type = ingredient.effects[j].type.slice(4);
                    atk_type_bonus[type] = (atk_type_bonus[type] || 0) + amount;
                }
                else if (ingredient.effects[j].type.startsWith("def_"))
                {
                    let type = ingredient.effects[j].type.slice(4);
                    def_type_bonus[type] = (def_type_bonus[type] || 0) + amount;
                }
                else
                {
                    switch(ingredient.effects[j].type)
                    {
                        case "hp":
                            hp_bonus += amount;
                            break;
                        case "atk":
                            atk_type_bonus["physical"] = (atk_type_bonus["physical"] || 0) + amount;
                            break;
                        case "def":
                            def_type_bonus["physical"] = (def_type_bonus["physical"] || 0) + amount;
                            break;
                        case "hit":
                            hitChance_bonus += amount;
                            break;
                    }
                }
            }
        }

        let bakedGood = new Food({ name: this.getFoodName(), hp_bonus: hp_bonus, atk_type_bonuses: atk_type_bonus, hitChance_bonus: hitChance_bonus, def_type_bonuses: def_type_bonus });
        this.clearSelected();

        return bakedGood;
    }

    clearSelected()
    {
        for(let i = 0; i < this.selected.length; i++)
        {
            document.getElementById(this.selected[i]).style.backgroundColor = "";

            this.updateItemHTML(this.selected[i], this.inventory.getAmount(this.selected[i]), document.getElementById(this.selected[i]));
        }

        this.selected = [];
    }

    bake(container)
    {
        let bakedGood = this.createFood();
        container.empty();
        let bakeText = this.getBakeResultHTML(bakedGood);
        container.append(bakeText);
        container.append(document.createElement("br"))
        let serveButton = document.createElement("button");
        serveButton.innerText = "Serve";
        serveButton.setAttribute("class","btn btn-primary");
        $(serveButton).click(() => this.serveBakedGood(bakedGood));
        container.append(serveButton);
    }

    serveBakedGood(bakedGood)
    {
        bakingComplete();
        onFinishBaking(bakedGood);
    }

    //Update stock levels
    handleNewDay()
    {
        this.inventory.receiveStock(2);
    }

    loadBakingScreen()
    {
        this.updateIngredientsContainer($("#ingredients"));
        $("#bakeResult").empty();
        $("#bakeButton").unbind("click"); //Ben: prevent multiple click handlers
        $("#bakeButton").click(function() { bakery.bake($("#bakeResult")) });
    }

    constructor()
    {
        this.selected = new Array();
        let bakery = this;

        $.ajax({
            type: "GET",
            url: "data/recipes.csv",
            dataType: "text",
            success: function(data) {bakery.populateRecipes(data);}
        });

        $.ajax({
            type: "GET",
            url: "data/ingredients.csv",
            dataType: "text",
            success: function(data) {bakery.loadInventory(data);}
        });
    }
}

var bakery = new Bakery();
