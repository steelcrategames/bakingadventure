class Stats {
    constructor(hp, atk, hitChance, def, appetite)
    {
        this.max_hp = hp;
        this.atk = atk;
        this.hitChance = hitChance;
        this.def = def;
        this.appetite = appetite;

        this.hp = this.max_hp;
    }
}

function simulateQuest(hero)
{
    let quest = hero.current_quest;
    let enemy = quest.enemy;

    while(true)
    {
        //Hero attacks first
        let heroWin = simulateTurn(hero, enemy);

        if (heroWin)
        {
            console.log("Hero wins");
            return true;
        }
        else
        {
            let enemyWin = simulateTurn(enemy, hero);

            if (enemyWin)
            {
                console.log("Enemy wins");
                return false;
            }
        }
    }
}

function simulateTurn(attacker, defender)
{
    let isHit = rollHit(attacker.stats.hitChance);

    console.log(`${attacker.name} rolls to hit (${attacker.stats.hitChance}%). ${isHit ? "HIT" : "MISS"}`);

    if (isHit)
    {
        let atk = attacker.stats.atk;
        let def = defender.stats.def;
        let dmg = Math.max(0, atk - def);

        console.log(`${attacker.name} attacks for ${atk} (def: ${def}), dealing ${dmg} damage!`);

        defender.stats.hp -= dmg;
        
        if (defender.stats.hp <= 0)
        {
            console.log(`${defender.name} is defeated!`);
            return true;
        }
        else
        {
            console.log(`${defender.name} has ${defender.stats.hp} HP remaining.`);
        }
    }
}

//Utility
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