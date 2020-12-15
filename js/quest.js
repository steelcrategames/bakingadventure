const QuestResult = {
    INCOMPLETE: 0,
    SUCCESS: 1,
    FAILURE: 2
};
Object.freeze(QuestResult);

const SettingModifiers = {
    NORMAL: { 
        name: "run of the mill"
    },
    FROSTY: { 
        name: "frosty",
        atk_types: { "ice": 3 }, 
        def_types: { "physical": 10, "ice": 3, "fire": -5 }
    },
    FIREY: {
        name: "lava drenched",
        atk_types: { "fire": 3 }, 
        def_types: { "physical": 10, "ice": -5, "fire": 3 }
    }
};
Object.freeze(SettingModifiers);


const EnemyTemplates = {
    GOBLIN: new Enemy("Goblin", 
                new Stats(
                    {
                        hp: 10, 
                        atk_types: {"physical": 3}, 
                        hitChance: 50, 
                        def_types: {"physical": 2}
                    })),
    SKELETON: new Enemy("Skeleton", 
                new Stats(
                    {
                        hp: 7, 
                        atk_types: {"physical": 2}, 
                        hitChance: 30, 
                        def_types: {"physical": 1}
                    })),
};
Object.freeze(EnemyTemplates);

class Quest {
    constructor(name, level, enemyTemplate)
    {
        this.name = name;
        this.level = level;
        this.enemyTemplate = enemyTemplate;

        this.result = QuestResult.INCOMPLETE;
    }
}

//Utility
function createRandomQuest(level)
{
    console.log(`Generating random quest of level ${level}.`);

    let mod = randSettingModifier(); 
    let enemyTemplate = randEnemyTemplate(); 

    //Mix in the modifiers
    enemyTemplate.stats.atk_types = combine(enemyTemplate.stats.atk_types, mod.atk_types);
    enemyTemplate.stats.def_types = combine(enemyTemplate.stats.def_types, mod.def_types);

    enemyTemplate.scaleToLevel(level);

    let questName = `${mod.name} ${enemyTemplate.name} Camp`.trim();

    return new Quest(questName, level, enemyTemplate);
}

function combine(types_a, types_b)
{
    let combined = {...types_a};

    if (types_b != null)
    {
        $.each(types_b, function(name, amount)
        {
            combined[name] = (combined[name] || 0) + amount;
        });
    }
    return combined;
}

function randSettingModifier()
{
    let keys = Object.keys(SettingModifiers);
    return SettingModifiers[keys[ keys.length * Math.random() << 0]]; 
}

function randEnemyTemplate()
{
    let keys = Object.keys(EnemyTemplates);
    return _.cloneDeep(EnemyTemplates[keys[ keys.length * Math.random() << 0]]); 
}