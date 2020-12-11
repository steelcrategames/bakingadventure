class Food
{
    constructor(name, hp_bonus, atk_bonus, hitChance_bonus, def_bonus)
    {
        this.name = name;
        this.hp_bonus = hp_bonus;
        this.atk_bonus = atk_bonus;
        this.hitChance_bonus = hitChance_bonus;
        this.def_bonus = def_bonus;
    }

    tooltip()
    {
        let txt = "";

        if (this.hp_bonus > 0)
        {
            txt += `HP +${this.hp_bonus} `;
        }

        if (this.atk_bonus > 0)
        {
            txt += `Attack +${this.atk_bonus} `;
        }

        if (this.hitChance_bonus > 0)
        {
            txt += `Hit Chance +${this.hitChance_bonus}% `;
        }

        if (this.def_bonus > 0)
        {
            txt += `Defence +${this.def_bonus} `;
        }

        return txt.trim();
    }
}