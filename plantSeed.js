/** @param {NS} ns **/

/**This script is for Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )
"Inspired by games like Else Heart.break(), Hacknet, Uplink, and Deus Ex, Bitburner is a programming-based idle incremental RPG where you, 
the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be 
changed through coding and solved or automated in whatever way you find suitable. "**/

/** SEED PLANTER: Cracks target server, then copies a 'hack seed' script to said server and runs it. */
export async function main(ns) { //Takes , 
	var target = ns.args[0]; //0: Server to 'plant' on.
	var targetsTarget = ns.args[1]; //1: Server the plant will be hacking.

//Run every cracking utility we have on targer server, then nuke.
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(target);
	};
	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(target);
	};
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(target);
	};
	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(target);
	};
	if (ns.fileExists("SQLInject.exe", "home")) {
		ns.sqlinject(target);
	}
	ns.nuke(target);

//Now that the server's paved, copy the hack seed over and run it.
	ns.scp("hackSeed.js", target, "home");
	ns.exec("hackSeed.js", target, 1, targetsTarget);
	ns.print("Planting effort complete.");
}