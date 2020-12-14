class Hero
{
    constructor(name, title, quote)
    {
        this.name = name;
        this.title = title;
        this.quote = quote;

        this.stats = new Stats({hp: 10, atk_types: { "physical": 5 }, hitChance: 75, def_types: { "physical": 2 }, appetite: 2});

        this.has_done_intro = false;
        this.completed_quests = [];
    }

    setFood(food)
    {
        this.stats.food.push(food);
    }

    setQuest(quest)
    {
        this.current_quest = quest;
    }

    finishQuest()
    {
        this.completed_quests.push(this.current_quest);
        this.current_quest = null;

        //TODO: level up

        //Rest & Recover
        this.stats.hp = this.stats.max_hp;
        this.stats.food = [];
    }

    getSuccessfulQuestCount()
    {
         return this.completed_quests.filter(q => q.result == QuestResult.SUCCESS).length; 
    }
}

function createRandomHero()
{
    const skillLevels = [ "Novice", "Apprentice", "Experienced", "Savvy" ];
    const titles = [ "Knight", "Squire", "Bard", "Adventurer", "Farmer" ];

    let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + "immy";
    let title = "the " + skillLevels[Math.floor(Math.random() * skillLevels.length)] + " " + titles[Math.floor(Math.random() * titles.length)];
    let quote = name + "'s the name and adventuring is my game!";

    return new Hero(name, title, quote);
}