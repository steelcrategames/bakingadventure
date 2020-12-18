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
        this.known = false;
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
        let id = name;
        item.innerHTML = "";
        item.setAttribute("id", id);
        item.setAttribute("class", "lemon");
        let div = document.createElement("div");
        div.setAttribute("class", "spacer");
        item.append(div);
        item.append(document.createElement("br"));
        item.append(document.createElement("span").innerText = "x" + value);
    }

    loadInventory(data)
    {
        this.selected = [];
        this.loadIngredients(data);
    }

    updateDescriptionPane(name, effects)
    {
        let descriptionPane = $("#baking-sel-details");

        descriptionPane.empty();

        let title = document.createElement("div")
        descriptionPane.append(title);
        title.setAttribute("class", "baking-sel-title");
        title.setAttribute("style", "text-align:center;");
        let titleImg = document.createElement("img");
        title.append(titleImg);
        titleImg.setAttribute("src", "img/cupcake-sword.png");
        titleImg.setAttribute("style", "width: 128px;");
        title.append(document.createElement("br"));
        title.append(document.createElement("span").innerText = name);

        let effectsTable = document.createElement("table");
        descriptionPane.append(effectsTable);
        effectsTable.setAttribute("style", "text-align: left;");
        for(let i = 0; i < effects.length; i++)
        {
            let effectRow = document.createElement("tr");
            effectsTable.append(effectRow);
            if(effects[i].known)
            {
                let effectTypeTD = document.createElement("td");
                effectRow.append(effectTypeTD);
                effectTypeTD.innerText = effects[i].type;
                let effectAmountTD = document.createElement("td");
                effectRow.append(effectAmountTD);
                effectAmountTD.innerText = effects[i].amount;
            }
            else
            {
                let effectTypeTD = document.createElement("td");
                effectRow.append(effectTypeTD);
                effectTypeTD.innerText = "????";
            }
        }
    }

    updateIngredientsContainer(container)
    {
        container.empty();
        let i = 0;
        let row = null;
        this.inventory.IngredientAmounts.forEach((value, key) => {
            if(i++ % 4 == 0)
            {
                row = document.createElement("tr");
                container.append(row);
            }

            let item = document.createElement("td");
            this.updateItemHTML(key.name, value, item);

            let bakery = this;
            $(item).hover(function () {
                    let ingredient = bakery.inventory.getIngredient(item.id);
                    bakery.updateDescriptionPane(ingredient.name, ingredient.effects);
                    
                }, function () {
                    // out
                }
            );
            $(item).click(function() {
                if(bakery.inventory.getAmount(item.id) > 0)
                {
                    if(bakery.selected.indexOf(item.id) > -1)
                    {
                        bakery.selected.splice(bakery.selected.indexOf(item.id), 1);
                        item.style.backgroundColor = "";
                    }
                    else if (bakery.selected.length < MAX_INGREDIENTS)
                    {
                        bakery.selected.push(item.id);
                        item.style.backgroundColor = "#2F4F4F";
                    }
                    bakery.updateSelected()
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
            if(ingredient.effects[i].known)
            {
                description += "<p>" + ingredient.effects[i].type + " " + ingredient.effects[i].amount + "</p>"
            }
            else
            {
                description += "<p>?????</p>"; 
            }
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

    consolidateEffects(ingredients, shouldDiscover = true)
    {
        let effectTypes = new Map();
        let consolidatedEffects = [];
        for(let i = 0; i < ingredients.length; i++)
        {
            let ingredient = this.inventory.getIngredient(ingredients[i]);
            for(let j = 0; j < ingredient.effects.length; j++)
            {
                let effect = ingredient.effects[j];
                if(!effectTypes.has(effect.type))
                {
                    effectTypes.set(effect.type, []);
                    
                }

                effectTypes.get(effect.type).push(effect)
            }
        }

        effectTypes.forEach((value, key) => {
            if(value.length > 1)
            {
                let effect = new Effect(value[0].type, 0);
                for(let i = 0; i < value.length; i++)
                {
                    if(shouldDiscover)
                    {
                        value[i].known = true;
                    }
                    effect.amount += parseInt(value[i].amount);
                }
                consolidatedEffects.push(effect);
            }
        });

        return consolidatedEffects;
    }

    getFoodFromSelected()
    {
        let hp_bonus = 0;
        let atk_type_bonus = {};
        let hitChance_bonus = 0;
        let def_type_bonus = {};
        
        let effects = this.consolidateEffects(this.selected);
        
        for(let j = 0; j < effects.length; j++)
        {
            let amount = parseFloat(effects[j].amount);

            if (effects[j].type.startsWith("atk_"))
            {
                let type = effects[j].type.slice(4);
                atk_type_bonus[type] = (atk_type_bonus[type] || 0) + amount;
            }
            else if (effects[j].type.startsWith("def_"))
            {
                let type = effects[j].type.slice(4);
                def_type_bonus[type] = (def_type_bonus[type] || 0) + amount;
            }
            else
            {
                switch(effects[j].type)
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

        let bakedGood = new Food({ name: this.getFoodName(), hp_bonus: hp_bonus, atk_type_bonuses: atk_type_bonus, hitChance_bonus: hitChance_bonus, def_type_bonuses: def_type_bonus });

        return bakedGood;
    }

    createFood()
    {    
        let bakedGood = this.getFoodFromSelected();

        for(let i = 0; i < this.selected.length; i++)
        {
            let ingredient = this.inventory.getIngredient(this.selected[i]);

            this.inventory.removeIngredient(ingredient, 1);
        }

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
        this.updateSelected();
    }

    updateSelected()
    {
        $("#ingredient-chosen-1").unbind("mouseenter mouseleave");
        $("#ingredient-chosen-2").unbind("mouseenter mouseleave");
        $("#bakeButton").unbind("mouseenter mouseleave");
        $("#ingredient-chosen-1").attr("class", "blank");
        $("#ingredient-chosen-2").attr("class", "blank");
        let bakery = this;
        if(this.selected.length > 0)
        {
            $("#ingredient-chosen-1").attr("class", "lemon");
            $("#ingredient-chosen-1").hover(function () {
                let ingredient = bakery.inventory.getIngredient(bakery.selected[0]);
                bakery.updateDescriptionPane(ingredient.name, ingredient.effects);
            }, function () {
                // out
            });
        }
        if(this.selected.length > 1)
        {
            $("#ingredient-chosen-2").attr("class", "lemon");
            $("#ingredient-chosen-2").hover(function () {
                let ingredient = bakery.inventory.getIngredient(bakery.selected[1]); 
                bakery.updateDescriptionPane(ingredient.name, ingredient.effects);
            }, function () {
                // out
            });

            let foodName = this.getFoodName();
            if(foodName != "Soggy Mess")
            {
                $("#baking-result-preview").attr("class", "lemon");
            }
            else
            {
                $("#baking-result-preview").attr("class", "unknown");
            }

            $("#baking-result-preview").hover(function () {
                bakery.updateDescriptionPane(foodName, bakery.consolidateEffects(bakery.selected, false));
            }, function () {
                // out
            });
        }
        else
        {
            $("#baking-result-preview").attr("class", "unknown");
        }
    }

    updateResultsWindow(name, effects)
    {
        $("#baked-type")[0].innerText = name;

        let effectsTable = $("#result-effects-table")[0];
        effectsTable.innerHTML = "";
        effectsTable.setAttribute("style", "text-align: left;");
        for(let i = 0; i < effects.length; i++)
        {
            let effectRow = document.createElement("tr");
            effectsTable.append(effectRow);
            let effectTypeTD = document.createElement("td");
            effectRow.append(effectTypeTD);
            effectTypeTD.innerText = effects[i].type;
            let effectAmountTD = document.createElement("td");
            effectRow.append(effectAmountTD);
            effectAmountTD.innerText = effects[i].amount;
        }
    }

    bake()
    {
        $("#baking-window").hide();
        $("#baking-result-window").show();
        let bakedGood = this.createFood();
        this.updateResultsWindow(bakedGood.name, this.consolidateEffects(this.selected, false));
        this.clearSelected();
        $("#serveButton").unbind("click");
        $("#serveButton").click(() => this.serveBakedGood(bakedGood));
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
        $("#baking-window").show();
        $("#baking-result-window").hide();
        this.updateIngredientsContainer($("#ingredients-table"));
        this.updateSelected();
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

function logAllRecipes()
{
    let recipeMap = new Map();
    bakery.inventory.IngredientAmounts.forEach((value, key) => {
        bakery.inventory.IngredientAmounts.forEach((value2, key2) => {
            if(key != key2){
                if(bakery.consolidateEffects([key.name, key2.name]).length > 0)
                {
                    let rmKey = [key.name, key2.name].sort().join();
                    recipeMap.set(rmKey, ",," + key.name + "," + key2.name);
                    //console.log(",," + key.name + "," + key2.name);
                }
            }
        });
    });

    recipeMap.forEach((value, key) =>{console.log(value);})
}

function generateIngredients()
{
    let effectTypes = ["hit", "hp", "def", "atk", "atk_fire", "atk_ice", "def_fire", "def_ice"];
    let ingredients = [];


    for(let i = 0; i < 10; i++)
    {
        let ingString = ',,'

        let effectTypesCopy = [...effectTypes];
        for(let j = 0; j < 4; j++)
        {
            let index = Math.floor(Math.random() * effectTypesCopy.length);
            ingString += effectTypesCopy[index];
            effectTypesCopy.splice(index, 1);
            ingString += ",";
            ingString += Math.floor(Math.random() * 5) + 1; 
            ingString += ",";
        }

        ingredients.push(ingString);
        console.log(ingString);
    }
}