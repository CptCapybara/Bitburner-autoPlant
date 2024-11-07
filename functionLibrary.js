/** @param {NS} ns */

//This script is for programming-based idle incremental game Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )

/**FUNCTION LIBRARY: Contains delicious functions for our other scripts!
 * Keep in mind when importing scripts this way in Bitburner, you have to manually feed them 'ns'/the namespace.
*/

export async function TryFullGrow(growTargetServer, ns){
	while (ns.getServerMoneyAvailable(growTargetServer) < ns.getServerMaxMoney(growTargetServer)){
		await ns.grow(growTargetServer);
		
		while (ns.getServerSecurityLevel(growTargetServer) > ns.getServerMinSecurityLevel(growTargetServer)){
			await ns.weaken(growTargetServer);
		}
	}
}

export async function TryFullWeaken(weakenTargetServer, ns){
	while (ns.getServerSecurityLevel(weakenTargetServer) > ns.getServerMinSecurityLevel(weakenTargetServer)){
		await ns.weaken(weakenTargetServer);
	}
}

export async function RemoteCrack(targetServer, ns){
	let breakerCount = 0;
	if (ns.fileExists("BruteSSH.exe", "home")) {ns.brutessh(targetServer); breakerCount++;}
	if (ns.fileExists("FTPCrack.exe", "home")) {ns.ftpcrack(targetServer); breakerCount++;}
	if (ns.fileExists("HTTPWorm.exe", "home")) {ns.httpworm(targetServer); breakerCount++;}
	if (ns.fileExists("relaySMTP.exe", "home")) {ns.relaysmtp(targetServer); breakerCount++;}
	if (ns.fileExists("SQLInject.exe", "home")) {ns.sqlinject(targetServer); breakerCount++;}
	if (breakerCount >= ns.getServerNumPortsRequired(targetServer)) ns.nuke(targetServer);

	if (ns.getServerRequiredHackingLevel(targetServer) <= ns.getPlayer().skills.hacking
			&& ns.hasRootAccess(targetServer)){
		return true;
	}
	else {
		return false;
	}
}

export async function CountBreakers(ns){
	let breakerCount = 0;

	breakerCount += (ns.fileExists("BruteSSH.exe", "home") + 
				ns.fileExists("FTPCrack.exe", "home") + 
				ns.fileExists("HTTPWorm.exe", "home") +
				ns.fileExists("relaySMTP.exe", "home") +
				ns.fileExists("SQLInject.exe", "home"))

	return breakerCount
}

export async function CrackAllServers(serverList, ns){
	for (const serverName of Object.keys(serverList)){
		RemoteCrack(serverName, ns);
	}
}

export async function IsCracked(server, ns){
	if(ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server) <= ns.getPlayer().skills.hacking){
		return true;
	}
	else {
		return false;
	}
}