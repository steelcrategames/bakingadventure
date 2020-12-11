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

function simulateQuest(hero)
{
    //Update hero's HP, taking food into consideration
    hero.stats.hp = hero.stats.getMaxHP();
    sim_log(`${hero.name} has ${hero.stats.hp} HP for this quest.`);
    let quest = hero.current_quest;
    let enemy = quest.enemy;

    while(true)
    {
        //Hero attacks first
        let heroWin = simulateTurn(hero, enemy);

        if (heroWin)
        {
            sim_log("Hero wins");
            return true;
        }
        else
        {
            let enemyWin = simulateTurn(enemy, hero);

            if (enemyWin)
            {
                sim_log("Enemy wins");
                return false;
            }
        }
    }
}

function simulateTurn(attacker, defender)
{
    let isHit = rollHit(attacker.stats.getHitChance());

    sim_log(`${attacker.name} rolls to hit (${attacker.stats.getHitChance()}%). ${isHit ? "HIT" : "MISS"}`);

    if (isHit)
    {
        let atk = attacker.stats.getAtk();
        let def = defender.stats.getDef();
        let dmg = Math.max(0, atk - def);

        sim_log(`${attacker.name} attacks for ${atk} (def: ${def}), dealing ${dmg} damage!`);

        defender.stats.hp -= dmg;
        
        if (defender.stats.hp <= 0)
        {
            sim_log(`${defender.name} is defeated!`);
            return true;
        }
        else
        {
            sim_log(`${defender.name} has ${defender.stats.hp} HP remaining.`);
        }
    }
}

//Utility
function sim_log(msg)
{
    console.log(msg);
    log(msg);
}

function rollHit(hitChance)
{
    return hitChance > (Math.random() * 100);
}

function d6() {
    return Math.floor(Math.random() * 6) + 1;
}

function d20() {
    return Math.floor(Math.random() * 20) + 1;
}

function getModifier(value)
{
    if (value <= 1) { return -5; }
    else if (value <= 3) { return -4; }
    else if (value <= 5) { return -3; }
    else if (value <= 7) { return -2; }
    else if (value <= 9) { return -1; }
    else if (value <= 11) { return 0; }
    else if (value <= 13) { return 1; }
    else if (value <= 15) { return 2; }
    else if (value <= 17) { return 3; }
    else if (value <= 19) { return 4; }
    else if (value <= 21) { return 5; }
    else if (value <= 23) { return 6; }
    else if (value <= 25) { return 7; }
    else if (value <= 27) { return 8; }
    else if (value <= 29) { return 9; }
    else { return 10; }
}