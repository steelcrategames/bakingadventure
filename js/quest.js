const QuestResult = {
    INCOMPLETE: 0,
    SUCCESS: 1,
    FAILURE: 2
};
Object.freeze(QuestResult);

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

    let enemyTemplate = new Enemy("Goblin", 
                            new Stats(
                                {
                                    hp: 5, 
                                    atk_types: {"physical": 1}, 
                                    hitChance: 50, 
                                    def_types: {"physical": 1, "cold" : -10}
                                }));
    enemyTemplate.scaleToLevel(level);

    return new Quest("Goblin Camp", level, enemyTemplate);
}