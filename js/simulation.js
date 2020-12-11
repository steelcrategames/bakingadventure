class Stats {
    constructor(str, dex, con, int, wis, chr, appetite)
    {
        this.str = str;
        this.dex = dex;
        this.con = con;
        this.int = int;
        this.wis = wis;
        this.chr = chr;
        this.appetite = appetite;

        this.max_hp = this.rollMaxHP();
        this.hp = this.max_hp;
    }

    rollMaxHP()
    {
        let hp = 0;

        for(let i = 0; i < 4; i++)
        {
            hp += d6() + getModifier(this.con);
        }

        return hp;
    }
}

function simulateQuest(hero)
{
    let quest = hero.current_quest;
    let enemy = quest.enemy;

    //Hero attacks first
    while(true)
    {
        //HERO TURN
        //TODO: this is where food will come into play. Basic sim for now, trading hits.
        let hitChance = d20();
        let isHit = (hitChance >= 10);

        console.log(`${hero.name} rolls ${hitChance} to hit. ${isHit ? "HIT" : "MISS"}`);

        if (isHit)
        {
            let dmgRoll = d6();
            let mod = getModifier(hero.stats.str)
            let damage = dmgRoll + mod;
            console.log(`${hero.name} deals ${damage} (${dmgRoll} + ${mod}) to ${enemy.name}!`);
            
            enemy.hp -= damage;
            
            if (enemy.hp <= 0)
            {
                console.log(`${enemy.name} is defeated!`);
                return true;
            }
            else
            {
                console.log(`${enemy.name} has ${enemy.hp} HP remaining.`);
            }
        }

        //ENEMY TURN
        hitChance = d20();
        isHit = (hitChance >= 15);

        console.log(`${enemy.name} rolls ${hitChance} to hit. ${isHit ? "HIT" : "MISS"}`);

        if (isHit)
        {
            let dmgRoll = d6();
            let mod = quest.level;
            let damage = dmgRoll + mod;
            console.log(`${enemy.name} deals ${damage} (${dmgRoll} + ${mod}) to ${hero.name}!`);
            
            hero.stats.hp -= damage;
            
            if (hero.stats.hp <= 0)
            {
                console.log(`${hero.name} is defeated!`);
                return false;
            }
            else
            {
                console.log(`${hero.name} has ${hero.stats.hp} HP remaining.`);
            }
        }
    }
}

//Utility
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