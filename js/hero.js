class Hero
{
    constructor(name, title, quote, appetite)
    {
        this.name = name;
        this.title = title;
        this.quote = quote;

        this.stats = new Stats(10, 5, 75, 2, "Small");

        this.food = null;

        this.has_done_intro = false;
        this.completed_quests = [];
    }

    setFood(food)
    {
        this.food = food;
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
    }
}

function createRandomHero()
{
    const appetites = [ "small", "medium", "large" ];
    const skillLevels = [ "Novice", "Apprentice", "Experienced", "Savvy" ];
    const titles = [ "Knight", "Squire", "Bard", "Adventurer", "Farmer" ];

    let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + "immy";
    let title = "the " + skillLevels[Math.floor(Math.random() * skillLevels.length)] + " " + titles[Math.floor(Math.random() * titles.length)];
    let quote = name + "'s the name and adventuring is my game!";

    let appetite = appetites[Math.floor(Math.random() * appetites.length)];

    return new Hero(name, title, quote, appetite);
}