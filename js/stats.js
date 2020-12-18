class Stats {
    //ex
    //atk_types: { "physical": 1 , "cold": 3 } 
    //def_types: { "physical": 1 , "cold": 3 } 

    constructor({hp, atk_types = {}, hitChance, def_types = {}, appetite = 0})
    {
        this.max_hp = Number(hp);
        this.base_atk_types = atk_types;
        this.base_hitChance = Number(hitChance);
        this.base_def_types = def_types;
        this.appetite = appetite;

        this.hp = this.max_hp;

        this.food = []
    }

    to_string(withFoodBonuses = false)
    {
        let defTxt = this.getDef_string(withFoodBonuses);

        let atkTxt = this.getAtk_string(withFoodBonuses);

        let hitTxt = this.getHitChance(withFoodBonuses);
    
        if (withFoodBonuses)
        {
            return `HP: ${this.getMaxHP()} Def: ${defTxt} Attack: ${atkTxt} HitChance: ${this.base_hitChance}% Appetite: ${this.appetite}`;
        }
        else
        {
            return `Base HP: ${this.hp} Base Def: ${defTxt} Base Attack: ${atkTxt} Base HitChance: ${this.base_hitChance}% Appetite: ${this.appetite}`;
        }
    }

    getAtk_string(withFoodBonuses = false)
    {
        let atkTypes = withFoodBonuses ? this.getAtk() : this.base_atk_types;

        let atkTxt = "";
        $.each(atkTypes, function(name, amount) {
            atkTxt += `${amount} ${getEmoji(name)} `;
        });
        return atkTxt.trim();
    }

    getDef_string(withFoodBonuses = false)
    {
        let defTypes = withFoodBonuses ? this.getDef() : this.base_def_types;

        let defTxt = "";
        $.each(defTypes, function(name, amount) {
            defTxt += `${amount} ${getEmoji(name)} `;
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

    getHitChance(withFoodBonuses = false)
    {
        if (withFoodBonuses)
        {
            let hitChance_bonus = 0;
            this.food.forEach(food => hitChance_bonus += food.hitChance_bonus)
            return this.base_hitChance + hitChance_bonus;
        }
        else
        {
            return this.base_hitChance;
        }
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