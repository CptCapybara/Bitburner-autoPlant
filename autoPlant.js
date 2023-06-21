/** @param {NS} ns **/

/**This script is for Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )
"Inspired by games like Else Heart.break(), Hacknet, Uplink, and Deus Ex, Bitburner is a programming-based idle incremental RPG where you, 
the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be 
changed through coding and solved or automated in whatever way you find suitable. "**/

/**AUTO PLANTER: Builds and maintains a list of all servers, as well as the 'highscore' for the server with the most cash, and
 * the player's hacker level. 
 * 
 * In the main program loop, it checks for hacker-level-ups, and cracks un-cracked servers as the level increases. It also 
 * places hacking loops/seeds based on the RAM/etc capabilities of the server in question.
 * 
 * Note, a current limitation on this system: Every server self-hacks, which likely has very delayed results.
 * 
 * There's ALSO an optional "raze" mode argument that just tries to lower every server's security to zero, and then exits!
*/
export async function main(ns) {

ns.disableLog("ALL");

var hackerLvl = -99; 
var highscore = ["home",0]; //For logging highest $ value server - [0] name [1] $$$

//---------------SERVER LIST-------------------
let serverList = []; //The full list of servers
let scannedServers = []; //A temporary list to hold results from scans.

serverList.push("home"); //Home server is the first one on the list.
serverList = [].concat(ns.scan("home")); //Add the servers we can see from home to the list.

ns.print("Beginning server list.");

for(let i = 0; i < serverList.length; i++){ //Iterate through the server list

	scannedServers = ns.scan(serverList[i]); //Scan from current server in list

	for(let y = 0; y < scannedServers.length; y++){ //Iterate through the list of scanned servers

		var checkedServer = scannedServers[y]; //Server we're currently checking
		var isNew = true; //By default we assume it's a new server

		for(let x = 0; x < serverList.length; x++){
			//Check new scanned server against entire list
			if (checkedServer == serverList[x]){
				isNew = false; //If we find a matching server in list, the scanned one isn't new, so flag it false
				break;
			}
		}

		if (isNew) { //If it is new, add it to the full list.
			serverList.push(scannedServers[y])
			ns.print("Adding " + scannedServers[y] + " to server list.");
		//In case of mid-run execution, keep track of highest hacked server moneymax
			if (ns.getServerMaxMoney(scannedServers[y]) > highscore[1] && ns.hasRootAccess(scannedServers[y])) { 
				highscore[0] = scannedServers[y];
				highscore[1] = ns.getServerMaxMoney(scannedServers[y]);
			}
		};
	}
}
ns.print("List compiled! Have fun.");

//------------------RAZE MODE-------------------------- Try and lower the security on every server in list to minimum.
if (ns.args[0] == "raze"){
		var threadTarget = 0;
		for(let r = 0; r < serverList.length; r++){ //Iterate through server list
		//ns.print("Testing " + serverList[r]);
			if (ns.getServerSecurityLevel(serverList[r]) > (ns.getServerMinSecurityLevel(serverList[r]) + 2) //If server isn't already practically at min sec
				&& ns.hasRootAccess(serverList[r])){ //And if we have root access
				threadTarget = Math.floor((ns.getServerSecurityLevel(serverList[r]) - ns.getServerMinSecurityLevel(serverList[r]))/ns.weakenAnalyze(1)) + 1; //How many threads would it take to fully weaken? Plus 1 for good measure
				while(((ns.getServerMaxRam("home") - (ns.getServerUsedRam("home"))) / ns.getScriptRam("justWeaken.js")) < threadTarget){ //If home doesn't have enough RAM, sleep until it does
				await	ns.sleep(5000);
				}
				//ns.alert("threadTarget for " + serverList[r] + " is " + threadTarget); //In case of weirdness
				ns.print("Weakening " + serverList[r] + " with " + threadTarget + " threads.");
				ns.run("justWeaken.js", threadTarget, serverList[r]);
			}
		}
	ns.exit(); //Razed, ending script.
}

//---------------------MAIN LOOP---------------------When hack level has increased, see if there's any new servers you can crack,
//, crack 'em, and then install an auto/self hacker based on the ram & money level of the server
while (true) {
	if (ns.getHackingLevel() >= (hackerLvl + 10)){ //If your level has gone up a decent amount, reevaluate servers
		hackerLvl = ns.getHackingLevel();
		ns.print("Hacking level up! Good job?");

		for(let z = 0; z < serverList.length; z++){ //Iterating through server list,
		//Check if something has a req'd hacking level below the current level AND that it hasn't been rooted yet.
			if( (ns.getServerRequiredHackingLevel(serverList[z]) <= hackerLvl && !(ns.hasRootAccess(serverList[z])) &&
				((ns.fileExists("BruteSSH.exe", "home") + //Check if we have enough port breakers to root, 
				ns.fileExists("FTPCrack.exe", "home") + //Add up (booleans) how many port breakers VS ports req'd
				ns.fileExists("HTTPWorm.exe", "home") +
				ns.fileExists("relaySMTP.exe", "home") +
				ns.fileExists("SQLInject.exe", "home")
				) >= ns.getServerNumPortsRequired(serverList[z]))) || //OR, if a server's been hacked but just doesn't have any servers running...
				(ns.hasRootAccess(serverList[z]) && (ns.ps(serverList[z]).length == 0) ) ){ 
					
					//ns.print("Installing and running scripts on " + serverList[z]); //Let's do a more exacting print instead

					if (ns.getServerMaxMoney(serverList[z]) != 0){ //IF the server actually has cash
						if (ns.getServerMaxMoney(serverList[z]) > highscore[1]) { //Check if it beats the highscore
							highscore[0] = serverList[z];
							highscore[1] = ns.getServerMaxMoney(serverList[z]); //Logging new Highscore
						}
						
						if (ns.getServerMaxRam(serverList[z]) < ns.getScriptRam("hackSeed.js")){ //If the server has cash but low RAM:
							ns.run("plantSeed.js",1,serverList[z],serverList[z]); //Run plantSeed anyway just to nuke properly
							await ns.sleep(1000); //Give plantSeed a sec to nuke
							await ns.scp("lowRamSimpleHack.js", serverList[z], "home"); //Copy and run the lower-RAM early game script.
							ns.exec("lowRamSimpleHack.js", serverList[z],1,serverList[z]);
							ns.print("->Low-ram self-hack on " + serverList[z]);
						}
							ns.run("plantSeed.js",1,serverList[z],serverList[z]); //Else (Server has RAM and money), plantSeed normally!
							ns.print("->Standard ram self-hack on " + serverList[z]);
					}
					else { //Server has no cash :(
						if (ns.getServerMaxRam(serverList[z]) < ns.getScriptRam("plantSeed.js")){ //No ram OR cash?
							ns.run("plantSeed.js",1,serverList[z],serverList[z]); //Run plantSeed anyway just to nuke properly
							await ns.sleep(1000); //Give plantSeed a sec to nuke
							await ns.scp("lowRamSimpleHack.js", serverList[z], "home"); //Copy/run low-RAM script, but pointed at Highscore server!
							ns.exec("lowRamSimpleHack.js", serverList[z],1,highscore[0]);
							ns.print("->Low-ram target (" + highscore[0] + ") hack on " + serverList[z]);
						}
						else { //Server has no cash but decent RAM,
							ns.run("plantSeed.js",1,serverList[z],highscore[0]); //plantSeed normally, but target Highscore server.
							ns.print("->Standard ram target (" + highscore[0] + ") hack on " + serverList[z]);
						}				
					}
			}
		}
		ns.print("Highscore: " + highscore[0] + ": $" + highscore[1]); //Just so the player knows!
	}

	await ns.sleep(60000); //Sleep and check hacker level again in a minute!

}

}