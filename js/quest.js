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

    var keys = Object.keys(SettingModifiers);
    let mod = SettingModifiers[keys[ keys.length * Math.random() << 0]]; 


    let basic_atk_types = {"physical": 1};
    let basic_def_types = {"physical": 1};

    let enemyTemplate = new Enemy("Goblin", 
                            new Stats(
                                {
                                    hp: 5, 
                                    atk_types: combine(basic_atk_types, mod.atk_types), 
                                    hitChance: 50, 
                                    def_types: combine(basic_def_types, mod.def_types)
                                }));
    enemyTemplate.scaleToLevel(level);

    let questName = `${mod.name} Goblin Camp`.trim();

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