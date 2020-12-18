var quest = null;

function simulateQuest(hero)
{
    quest = hero.current_quest;
    quest.log = [];

    //Update hero's HP, taking food into consideration
    hero.stats.hp = hero.stats.getMaxHP();
    
    let num_enemies_remaining = 1; //TODO: figure out when we want multiple enemies. Previously: quest.actual_level
    let enemyNum = 1;

    let enemy = SpawnEnemy(quest.enemyTemplate, enemyNum);
    sim_log(`${enemy.name} appears!`);

    let max_rounds = 100;

    while(max_rounds > 0)
    {
        //Hero attacks first
        let heroWin = simulateTurn(hero, enemy);

        if (heroWin)
        {
            quest.result = QuestResult.SUCCESS;
            num_enemies_remaining -= 1;

            if (num_enemies_remaining > 0)
            {
                enemyNum += 1;
                //Spawn another enemy
                enemy = SpawnEnemy(quest.enemyTemplate, enemyNum);
                sim_log(`${enemy.name} appears!`);
            }
            else
            {
                sim_log("Hero wins");
                quest.result = QuestResult.SUCCESS;
                return true;
            }
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

        max_rounds -= 1;
    }

    sim_log("Hero got tired after 100 rounds and went home.");
    quest.result = QuestResult.FAILURE;
    return false;
}

function simulateTurn(attacker, defender)
{
    let isHit = rollHit(attacker.stats.getHitChance());

    sim_log(`${attacker.name} rolls to hit (${attacker.stats.getHitChance()}%) => ${isHit ? "HIT" : "MISS"}`);

    if (isHit)
    {
        let atk = attacker.stats.getAtk();
        let def = defender.stats.getDef();
        let dmg = 0;
        
        //Calculate the amount of damage per type, combined into one "damage" total
        $.each(atk, function(name, amount) {
            let blockedAmount = 0;
            
            if (def.hasOwnProperty(name))
            {
                blockedAmount += def[name];
            }

            dmg += Math.max(0, amount - blockedAmount);
        });

        //Format nicely
        let atkTxt = "";
        $.each(atk, function(name, amount) {
            atkTxt += `${amount} ${getEmoji(name)} `;
        });
        atkTxt = atkTxt.trim();

        let defTxt = "";
        $.each(def, function(name, amount) {
            defTxt += `${amount} ${getEmoji(name)} `;
        });
        defTxt = defTxt.trim();

        sim_log(`${attacker.name} attacks for [${atkTxt}] (def: [${defTxt}]), dealing ${dmg} damage!`);

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