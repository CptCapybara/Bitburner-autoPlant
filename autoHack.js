/** @param {NS} ns */

//This script is for programming-based idle incremental game Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )

/**AUTO HACK: A fairly simple hacking loop!
*/

export async function main(ns) {

	//VARIABLES
	let targetServer = ns.args[0];
	let targetMaxMoney = ns.args[1]; //Pass in these values to save on RAM.
	let targetMinSecurity = ns.args[2];

	let serverSecurityBuffer = 2;

	//FUNCTIONS
	async function TryFullGrow(growTargetServer){
		while (ns.getServerMoneyAvailable(growTargetServer) < targetMaxMoney){
			await ns.grow(growTargetServer);
			
			while (ns.getServerSecurityLevel(growTargetServer) > targetMinSecurity + serverSecurityBuffer){
				await ns.weaken(growTargetServer);
			}
		}
	}

	async function TryFullWeaken(weakenTargetServer){
		while (ns.getServerSecurityLevel(targetServer) > targetMinSecurity){
			await ns.weaken(targetServer);
		}
	}

	//MAIN
	while (true){
		await TryFullWeaken(targetServer);
		await TryFullGrow(targetServer);

		while (ns.getServerMoneyAvailable(targetServer) == targetMaxMoney){
			await TryFullWeaken(targetServer);
			await ns.hack(targetServer);
		}
		ns.print("Hacked: $" + ns.getServerMoneyAvailable(targetServer) + " / $" + targetMaxMoney);
	}
}