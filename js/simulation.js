var quest = null;

function simulateQuest(hero)
{
    quest = hero.current_quest;
    quest.log = [];

    //Update hero's HP, taking food into consideration
    hero.stats.hp = hero.stats.getMaxHP();
    sim_log(`${hero.name} has ${hero.stats.hp} HP for this quest.`);
    
    let enemy = quest.enemy;

    while(true)
    {
        //Hero attacks first
        let heroWin = simulateTurn(hero, enemy);

        if (heroWin)
        {
            sim_log("Hero wins");
            quest.result = QuestResult.SUCCESS;
            return true;
        }
        else
        {
            let enemyWin = simulateTurn(enemy, hero);

            if (enemyWin)
            {
                sim_log("Enemy wins");
                quest.result = QuestResult.FAILURE;
                return false;
            }
        }
    }
}

function simulateTurn(attacker, defender)
{
    let isHit = rollHit(attacker.stats.getHitChance());

    sim_log(`${attacker.name} rolls to hit (${attacker.stats.getHitChance()}%) => ${isHit ? "HIT" : "MISS"}`);

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
    quest.log.push(msg);
}

function rollHit(hitChance)
{
    return hitChance > (Math.random() * 100);
}