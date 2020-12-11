class Enemy {
    constructor(name, stats)
    {
        this.name = name;
        this.stats = stats;
    }

    scaleToLevel(level)
    {
        this.stats.max_hp += level;
        this.stats.base_atk += level;
        this.stats.base_hitChance += level * 5;
        this.stats.base_def += level;
    }
}

function SpawnEnemy(enemyTemplate, id)
{
    let enemy = _.cloneDeep(enemyTemplate);
    enemy.name += `#${id}`;
    enemy.stats.hp = enemy.stats.getMaxHP();

    return enemy;
}