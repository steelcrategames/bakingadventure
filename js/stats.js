class Stats {
    constructor(hp, atk, hitChance, def, appetite)
    {
        this.max_hp = hp;
        this.base_atk = atk;
        this.base_hitChance = hitChance;
        this.base_def = def;
        this.appetite = appetite;

        this.hp = this.max_hp;

        this.food = []
    }

    to_string()
    {
        return `HP: ${this.hp} Def: ${this.base_def} Attack: ${this.base_atk} HitChance: ${this.base_hitChance}% Appetite: ${this.appetite}`;
    }

    getAtk()
    {
        let atk_bonus = 0;
        this.food.forEach(food => atk_bonus += food.atk_bonus)
        return this.base_atk + atk_bonus;
    }

    getHitChance()
    {
        let hitChance_bonus = 0;
        this.food.forEach(food => hitChance_bonus += food.hitChance_bonus)
        return this.base_hitChance + hitChance_bonus;
    }

    getDef()
    {
        let def_bonus = 0;
        this.food.forEach(food => def_bonus += food.def_bonus)
        return this.base_def + def_bonus;
    }

    getMaxHP()
    {
        let hp_bonus = 0;
        this.food.forEach(food => hp_bonus += food.hp_bonus)
        return this.max_hp + hp_bonus;
    }
}