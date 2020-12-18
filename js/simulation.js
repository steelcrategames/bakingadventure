var quest = null;

class CombatantStats
{
    constructor()
    {
        this.misses = 0;
        this.hits = 0;
        this.atk_dealt = { }; //Raw attack damage
        this.dmg_taken = { }; 
        this.dmg_blocked = { };
    }

    getAtkDealtTotal()
    {
        let total = 0;
        $.each(this.atk_dealt, function(name, amount)
        {
            total += amount;
        });
        return total;
    }

    getDmgTakenTotal()
    {
        let total = 0;
        $.each(this.dmg_taken, function(name, amount)
        {
            total += amount;
        });
        return total;
    }

    getDmgBlockedTotal()
    {
        let total = 0;
        $.each(this.dmg_blocked, function(name, amount)
        {
            total += amount;
        });
        return total;
    }
}

class SimStats
{
    constructor()
    {
        this.num_rounds = 0;
        this.hero = new CombatantStats();
        this.enemy = new CombatantStats();
    }
}

function simulateQuest(hero)
{
    quest = hero.current_quest;
    quest.log = []; //combat log
    quest.stats = new SimStats();
    let stats = quest.stats;

    //Update hero's HP, taking food into consideration
    hero.stats.hp = hero.stats.getMaxHP();
    
    let num_enemies_remaining = 1; //TODO: figure out when we want multiple enemies. Previously: quest.actual_level
    let enemyNum = 1;

    let enemy = SpawnEnemy(quest.enemyTemplate, enemyNum);
    sim_log(`${enemy.name} appears!`);

    let max_rounds = 100;

    while(max_rounds > 0)
    {
        stats.num_rounds += 1;

        //Hero attacks first
        let heroWin = simulateTurn(hero, enemy, stats.hero, stats.enemy);

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
            let enemyWin = simulateTurn(enemy, hero, stats.enemy, stats.hero);

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

function simulateTurn(attacker, defender, attacker_combat_stats, defender_combat_stats)
{
    let isHit = rollHit(attacker.stats.getHitChance());

    sim_log(`${attacker.name} rolls to hit (${attacker.stats.getHitChance()}%) => ${isHit ? "HIT" : "MISS"}`);

    if (isHit)
    {
        attacker_combat_stats.hits += 1;

        let atk = attacker.stats.getAtk();
        let def = defender.stats.getDef();
        let dmg = 0;
        
        recordAtkStats(attacker_combat_stats, atk);

        //Calculate the amount of damage per type, combined into one "damage" total
        $.each(atk, function(name, amount) {
            let blockedAmount = 0;
            
            if (def.hasOwnProperty(name))
            {
                blockedAmount += def[name];
            }

            dmg += Math.max(0, amount - blockedAmount);

            recordBlockedStats(defender_combat_stats, name, amount - dmg);
            recordDmgTaken(defender_combat_stats, name, dmg);
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
    else
    {
        attacker_combat_stats.misses += 1;
    }
}

function recordAtkStats(stats, atk)
{
    $.each(atk, function(name, amount)
    {
        stats.atk_dealt[name] = (stats.atk_dealt[name] || 0) + amount;
    });
}

function recordBlockedStats(stats, blocked_type, blocked_amount)
{
    stats.dmg_blocked[blocked_type] = (stats.dmg_blocked[blocked_type] || 0) + blocked_amount;
}

function recordDmgTaken(stats, dmg_type, dmg_amount)
{
    stats.dmg_taken[dmg_type] = (stats.dmg_taken[dmg_type] || 0) + dmg_amount;
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