class Quest {
    constructor(name, level, enemy)
    {
        this.name = name;
        this.level = level;
        this.enemy = enemy;

        this.outcome
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