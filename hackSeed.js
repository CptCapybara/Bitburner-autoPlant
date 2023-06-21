/** @param {NS} ns **/

/**This script is for Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )
"Inspired by games like Else Heart.break(), Hacknet, Uplink, and Deus Ex, Bitburner is a programming-based idle incremental RPG where you, 
the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be 
changed through coding and solved or automated in whatever way you find suitable. "**/

/** HACKING SEED: After being placed on a server, this evaluates the server's RAM/money/security and runs our
 * basic hacking loop script using that information.
 */
export async function main(ns) { 
    var target = ns.args[0]; //0: Target server

	//Get server's max money and security threshhold for hackability (I put this at minimum sec +2, for a small buffer.)
    var moneyMax = ns.getServerMaxMoney(target); 
    var securityThresh = ns.getServerMinSecurityLevel(target) + 2;

    //Find the available RAM on the server to see how many threads we can use for the basic hacking loop.
    var threadNum = Math.floor((ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname())) / 2.2);

    //Copy hack loop script over, and then run it.
    await ns.scp("basicHackLoop.js", target, "home")
    ns.spawn("basicHackLoop.js",threadNum,target,moneyMax,securityThresh);
}