class Stats {
    //ex
    //atk_types: { "physical": 1 , "cold": 3 } 
    //def_types: { "physical": 1 , "cold": 3 } 

    constructor({hp, atk_types = {}, hitChance, def_types = {}, appetite = 0})
    {
        this.max_hp = hp;
        this.base_atk_types = atk_types;
        this.base_hitChance = hitChance;
        this.base_def_types = def_types;
        this.appetite = appetite;

        this.hp = this.max_hp;

        this.food = []
    }

    to_string()
    {
        let defTxt = this.getDef_string();

        let atkTxt = this.getAtk_string();

        return `HP: ${this.hp} Def: ${defTxt} Attack: ${atkTxt} HitChance: ${this.base_hitChance}% Appetite: ${this.appetite}`;
    }

    getAtk_string()
    {
        let atkTxt = "";
        $.each(this.base_atk_types, function(name, amount) {
            atkTxt += `${name}: ${amount} `;
        });
        return atkTxt.trim();
    }

    getDef_string()
    {
        let defTxt = "";
        $.each(this.base_def_types, function(name, amount) {
            defTxt += `${name}: ${amount} `;
        });
        return defTxt.trim();
    }

    getAtk()
    {
        let atk = {...this.base_atk_types};

        this.food.forEach(food => 
            {
                $.each(food.atk_type_bonuses, function(name, amount)
                {
                    atk[name] = (atk[name] || 0) + amount;
                });
            });

        return atk;
    }

    getHitChance()
    {
        let hitChance_bonus = 0;
        this.food.forEach(food => hitChance_bonus += food.hitChance_bonus)
        return this.base_hitChance + hitChance_bonus;
    }

    getDef()
    {
        let def = {...this.base_def_types};

        this.food.forEach(food => 
            {
                $.each(food.def_type_bonuses, function(name, amount)
                {
                    def[name] = (def[name] || 0) + amount;
                });
            });

        return def;
    }

    getMaxHP()
    {
        let hp_bonus = 0;
        this.food.forEach(food => hp_bonus += food.hp_bonus)
        return this.max_hp + hp_bonus;
    }
}