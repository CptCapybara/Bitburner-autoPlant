/** @param {NS} ns **/

/**This script is for Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )
"Inspired by games like Else Heart.break(), Hacknet, Uplink, and Deus Ex, Bitburner is a programming-based idle incremental RPG where you, 
the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be 
changed through coding and solved or automated in whatever way you find suitable. "**/

//BASIC HACK LOOP: Using provided info about target server, weaken, grow, or hack target server depending on status.
//Threshholds are calculated before this to save on RAM.
export async function main(ns) { 
    var target = ns.args[0]; //0: Target server for hacking
    var moneyMax = ns.args[1]; //1: Maximum money of target server
    var securityThresh = ns.args[2]; //2: Security threshhold for optimal hacking

    while (true) {

        if (ns.getServerSecurityLevel(target) > securityThresh) { //Security above our desired threshhold? Weaken.
            await ns.weaken(target);
        } 
        else if (ns.getServerMoneyAvailable(target) < moneyMax) { //Server money not maxed out? Grow.
            await ns.grow(target);
        } 
        else {
            await ns.hack(target); //If the previous two criteria are met, then Hack!
        }
    }
}