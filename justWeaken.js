/** @param {NS} ns **/

/**This script is for Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )
"Inspired by games like Else Heart.break(), Hacknet, Uplink, and Deus Ex, Bitburner is a programming-based idle incremental RPG where you, 
the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be 
changed through coding and solved or automated in whatever way you find suitable. "**/

//JUST WEAKEN: Just weakens. That's it! I keep this in its own script to be flexible 
//about assigning the weaken function RAM.
export async function main(ns) {
	await ns.weaken(ns.args[0]);
}