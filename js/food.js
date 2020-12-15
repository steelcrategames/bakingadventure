class Food
{
    constructor( { 
            name,
            hp_bonus = 0, atk_type_bonuses = {}, hitChance_bonus = 0, def_type_bonuses = {}
        })
    {
        this.name = name;
        this.hp_bonus = hp_bonus;
        this.atk_type_bonuses = atk_type_bonuses;
        this.hitChance_bonus = hitChance_bonus;
        this.def_type_bonuses = def_type_bonuses;

    }

    tooltip()
    {
        let txt = "";

        if (this.hp_bonus > 0)
        {
            txt += `HP +${this.hp_bonus} `;
        }

        if (this.atk_type_bonuses != null)
        {
            $.each(this.atk_type_bonuses, function(name, amount) {
                if (amount != 0)
                {
                    txt += `Attack +${amount} ${getEmoji(name)}`;
                }
            });
        }

        if (this.hitChance_bonus > 0)
        {
            txt += `Hit Chance +${this.hitChance_bonus}% `;
        }

        if (this.def_type_bonuses != null)
        {
            $.each(this.def_type_bonuses, function(name, amount) {
                if (amount != 0)
                {
                    txt += `Defence +${amount} ${getEmoji(name)}`;
                }
            });
        }

        return txt.trim();
    }

    getHTML()
    {
        return `<span class="bakedgood" data-toggle="tooltip" title="${this.tooltip()}">${this.name}</span>`;
    }
}