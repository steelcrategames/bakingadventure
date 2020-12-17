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
    constructor({name, min_level, max_level, actual_level, enemyTemplate})
    {
        this.name = name;
        this.min_level = min_level;
        this.max_level = max_level;
        this.actual_level = actual_level;
        this.enemyTemplate = enemyTemplate;

        this.result = QuestResult.INCOMPLETE;
    }
}

class QuestGenerator 
{
    constructor()
    {
        let generator = this;
        this.enemyTemplates = {};
        this.questTemplates = {};

        $.ajax({
            type: "GET",
            url: "data/enemy_templates.csv",
            dataType: "text",
            success: function(data) { generator.populateEnemyTemplates(generator, data); }
        });
    }

    populateEnemyTemplates(generator, data)
    {
        let dataCSV = $.csv.toObjects(data);
        for(let i = 0; i < dataCSV.length; i++)
        {
            let name = dataCSV[i].name;
            let hp = dataCSV[i].hp;
            let hitChance = dataCSV[i].hitChance;

            //Attack types
            let atk_types = {};
            let num_atk_types = 2;

            for (let j = 0; j < num_atk_types; j++)
            {
                let atk_type = dataCSV[i]["atk_" + j + "_type"];
                
                if (atk_type != null && atk_type != "")
                {
                    atk_types[atk_type] = dataCSV[i]["atk_" + j + "_amount"];
                }
            }

            //Def types
            let def_types = {};
            let num_def_types = 2;

            for (let j = 0; j < num_def_types; j++)
            {
                let def_type = dataCSV[i]["def_" + j + "_type"];
                
                if (def_type != null && def_type != "")
                {
                    def_types[def_type] = dataCSV[i]["def_" + j + "_amount"];
                }
            }

            let enemyTemplate = new Enemy(name, new Stats({hp:hp, hitChance:hitChance, atk_types:atk_types, def_types:def_types}));

            this.enemyTemplates[name] = enemyTemplate;

            console.log(`Added enemy template ${enemyTemplate.name}: ${enemyTemplate.stats.to_string()}`);
        }

        $.ajax({
            type: "GET",
            url: "data/quests.csv",
            dataType: "text",
            success: function(data) { generator.populateQuestTemplates(data); }
        });
    }

    populateQuestTemplates(data)
    {
        let dataCSV = $.csv.toObjects(data);
        for(let i=0; i < dataCSV.length; i++)
        {
            let name = dataCSV[i].name;
            let min_level = dataCSV[i].min_level;
            let max_level = dataCSV[i].max_level;
            let enemyTemplateName = dataCSV[i].enemy_template;

            if (!(enemyTemplateName in this.enemyTemplates))
            {
                console.error(`Could not find enemy template ${enemyTemplateName} for use in Quest ${name}`);
            }
            else
            {
                let enemyTemplate = this.enemyTemplates[enemyTemplateName];
                let questTemplate = new Quest({ name: name, min_level: min_level, max_level: max_level, enemyTemplate: enemyTemplate });
                this.questTemplates[name] = questTemplate;

                console.log(`Added quest template: ${name}`);
            }
        }
    }

    createRandomQuest(level)
    {
        console.log(`Generating random quest of level ${level}.`);

        let questTemplate = this.randQuestTemplate(level);

        let mod = randSettingModifier();
        let enemyTemplate = questTemplate.enemyTemplate; 

        //Mix in the modifiers
        enemyTemplate.stats.atk_types = combine(enemyTemplate.stats.atk_types, mod.atk_types);
        enemyTemplate.stats.def_types = combine(enemyTemplate.stats.def_types, mod.def_types);

        questTemplate.actual_level = level;
        //enemyTemplate.scaleToLevel(level);

        questTemplate.name = `${mod.name} ${questTemplate.name}`.trim();

        return questTemplate;
    }

    randQuestTemplate(desiredLevel)
    {
        var filtered = _.pickBy(this.questTemplates, function(questTemplate) {
            return desiredLevel >= questTemplate.min_level  &&
                    desiredLevel <= questTemplate.max_level;
          });

        if (filtered.length == 0)
        {
            console.error(`No quest templates available for level ${level}!`);
        }

        let keys = Object.keys(filtered);
        return _.cloneDeep(filtered[keys[ keys.length * Math.random() << 0]]); 
    }
}

    //Utility
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
