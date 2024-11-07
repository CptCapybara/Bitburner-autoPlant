/** @param {NS} ns **/

//This script is for programming-based idle incremental game Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )

/**AUTO PLANTER: Gets a list of all servers, and maintains that list (hacking new servers) as player hacker level and number of breakers grows.
 * 
 * As written, this script is set up to make all servers that have both RAM & money run "self-hacks".
 * Also keeps track of which server has the highest max money, to use as target for hacking programs on servers with RAM but no money.
*/

import {CountBreakers, IsCracked, RemoteCrack} from 'functionLibrary.js'

export async function main(ns) {

	ns.disableLog("ALL");

	//VARIABLES
	let serverListPort = 20; //Port where we'll receive the server list from the list builder.
	let serverList = {};
	let highestMoneyServer = {}

	let breakerCount = await CountBreakers(ns);
	let hackStarter = 'hackStarter.js'; //hackStarter runs on home, copies our autoHack to the target, and initializes it.
	let hackerLvl = ns.getPlayer().skills.hacking;
	let lvlUpInterval = 5; //During maintanence loop, if hacker level has increased this much, try to find new server to hack.
	let loopPauseTime = 60000;


	//FUNCTIONS
	async function FindHighestMoneyServer(servers){
		for (const serverName of Object.keys(servers)){
			if(highestMoneyServer.MaxMoney == undefined || 
					servers[serverName].MaxMoney > highestMoneyServer.MaxMoney && servers[serverName].Cracked){
				highestMoneyServer = servers[serverName];
				highestMoneyServer.Name = serverName;
			}
		}
	}

	async function InitHackStarter(server){
		if(serverList[server].MaxMoney > 0 && serverList[server].RAM > 0){
			ns.run(hackStarter, 1, server, server);
		}
		else if(serverList[server].RAM > 0){
			ns.run(hackStarter, 1, server, highestMoneyServer.Name);
		}
	}

	async function CrackAndUpdateAll(){
		for (const serverName of Object.keys(serverList)){
			await RemoteCrack(serverName, ns);
			serverList[serverName].Cracked = await IsCracked(serverName, ns);
		}
	}


	//MAIN INITIALIZING
	ns.run("serverListBuilder.js", 1, serverListPort);
	await ns.sleep(3000);
	serverList = ns.readPort(serverListPort);
	ns.print("Server list obtained.");

	await CrackAndUpdateAll();
	ns.print("Cracked all available servers");
	
	await FindHighestMoneyServer(serverList);
	ns.print("Highest money server is... " + highestMoneyServer.Name + " at $" + highestMoneyServer.MaxMoney)

	for (const serverName of Object.keys(serverList)){
		if(serverList[serverName].Cracked){
			ns.print(`Starting hack on... ${serverName}`);
			await InitHackStarter(serverName);
		}
	}

	ns.print("Manager initialized successfully!");
	

	//MAIN LOOP
	while(true){
		if (breakerCount < 5){
			if (breakerCount < await CountBreakers(ns)){
				ns.print("New breaker found; updating list.");
				await CrackAndUpdateAll();
				breakerCount = await CountBreakers(ns);
			}
		}

		let newHackerLvl = ns.getPlayer().skills.hacking;

		if (newHackerLvl >= hackerLvl + lvlUpInterval){
			ns.print("Hacker level up! " + hackerLvl + " >> " + newHackerLvl);
			for (const serverName of Object.keys(serverList)){
				let checkedServer = serverList[serverName];

				if(!checkedServer.Cracked 
						&& checkedServer.ReqHackLvl <= newHackerLvl
						&& breakerCount >= checkedServer.ReqPorts){

					await RemoteCrack(serverName, ns);
					await InitHackStarter(serverName);
					checkedServer.Cracked = true;
					ns.print("Starting hack on... " + serverName);

					if(checkedServer.MaxMoney > highestMoneyServer.MaxMoney){ //TO DO: Implement updating targets of no-cash servers on this value changing.
						highestMoneyServer = checkedServer;
						highestMoneyServer.Name = serverName;
						ns.print("New highest money server... " + serverName);
					}
				}
			}
			hackerLvl = newHackerLvl;
		}

		await ns.sleep(loopPauseTime);
	}
}