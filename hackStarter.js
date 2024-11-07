/** @param {NS} ns */

//This script is for programming-based idle incremental game Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )

/**HACK STARTER: Runs on home, copies the listed hacking script to the 'host' server and initializes it with data.
*/

export async function main(ns) {

	let hostServer = ns.args[0];
	let targetServer = ns.args[1];
	let autoHackScript = 'autoHack.js';

	ns.scp(autoHackScript, hostServer);

	let threads = Math.floor(ns.getServerMaxRam(hostServer) / ns.getScriptRam(autoHackScript)); 
	ns.exec(autoHackScript, hostServer, threads, targetServer, 
		ns.getServerMaxMoney(targetServer), ns.getServerMinSecurityLevel(targetServer));
}