function getEmoji(type)
{
    switch(type)
    {
        case "physical": return String.fromCodePoint(0x1F5E1);
        case "ice": return String.fromCodePoint(0x1F9CA);
        case "fire": return String.fromCodePoint(0x1F525);
    }

    return type;
}