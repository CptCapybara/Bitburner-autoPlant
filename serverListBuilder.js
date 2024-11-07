/** @param {NS} ns */

//This script is for programming-based idle incremental game Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )

/**SERVER LIST BUILDER: Produces a dictionary of all servers in the game, each stored as an object and recording data like Max Money, RAM, etc, for convenience.
 * 
 * By default this purposefully ignores the player's owned servers.
 * Exports the info on a port (default 20).
*/

import {RemoteCrack} from 'functionLibrary.js'

export async function main(ns) {

	//ns.disableLog("ALL");


	//VARIABLES
	let serverList = {};
	let outPort = 20;
	let excludeOwnServers = true;

	if (ns.args[0] != null){
		outPort = ns.args[0];
	}
	if (ns.args[1] != null){
		excludeOwnServers = ns.args[1];
	}


	//FUNCTIONS
	async function GetNewServerInfo(newServer){
		return {
			MaxMoney: ns.getServerMaxMoney(newServer),
			MinSecurity: ns.getServerMinSecurityLevel(newServer),
			RAM: ns.getServerMaxRam(newServer),
			ReqHackLvl: ns.getServerRequiredHackingLevel(newServer),
			ReqPorts: ns.getServerNumPortsRequired(newServer),
			Cracked: false
		}
	}

	async function BuildServerList(){
		let tempServerList = {};
		let serverScanResults = [];
		serverScanResults = ns.scan("home");

		while(serverScanResults.length > 0){
			if(!(serverScanResults[0] in tempServerList)){
				let newServerInfo = await GetNewServerInfo(serverScanResults[0]);
				tempServerList[serverScanResults[0]] = newServerInfo;
				serverScanResults = serverScanResults.concat(ns.scan(serverScanResults[0]));
			}
			serverScanResults.splice(0, 1);
		}

		return tempServerList;
	}


	//MAIN
	serverList = await BuildServerList();

	if (excludeOwnServers){
		let ownedServers = ns.getPurchasedServers();
		for(let i = 0; i < ownedServers.length; i++){
			if(ownedServers[i] in serverList){
				delete serverList[ownedServers[i]];
			}
		}
	}

	ns.clearPort(outPort);
	ns.tryWritePort(outPort, serverList);
}