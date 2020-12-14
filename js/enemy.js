class Enemy {
    constructor(name, stats)
    {
        this.name = name;
        this.stats = stats;
    }

    scaleToLevel(level)
    {
        this.stats.max_hp += level;

        $.each(this.base_atk_types, function(name, amount) {
            this.base_atk_types[name] += level;
        });
        
        this.stats.base_hitChance += level * 5;

        $.each(this.base_def_types, function(name, amount) {
            this.base_def_types[name] += level;
        });
    }
}

function SpawnEnemy(enemyTemplate, id)
{
    let enemy = _.cloneDeep(enemyTemplate);
    enemy.name += `#${id}`;
    enemy.stats.hp = enemy.stats.getMaxHP();

    return enemy;
}