const QuestResult = {
    INCOMPLETE: 0,
    SUCCESS: 1,
    FAILURE: 2
};
Object.freeze(QuestResult);

class Quest {
    constructor(name, level, enemy)
    {
        this.name = name;
        this.level = level;
        this.enemy = enemy;

        this.result = QuestResult.INCOMPLETE;
    }
}

//Utility
function createRandomQuest()
{
    return new Quest(
        "Goblin Camp", 
        1, 
        new Enemy(
            "Goblin", 
            new Stats(5, 1, 50, 1, "None")));
}