/** @param {NS} ns **/

/**This script is for Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )
"Inspired by games like Else Heart.break(), Hacknet, Uplink, and Deus Ex, Bitburner is a programming-based idle incremental RPG where you, 
the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be 
changed through coding and solved or automated in whatever way you find suitable. "**/

//LOW RAM SIMPLE HACK: For servers with low RAM, this is basically the simple hack from the tutorial.
//Sets desirable cash and security threshhold, weakens, grows, or hacks based on those.
export async function main(ns) {
    var target = ns.args[0];
    var moneyThresh = ns.getServerMaxMoney(target) * 0.9;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 2;

    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}