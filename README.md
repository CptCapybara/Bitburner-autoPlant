These scripts are for Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )
"Inspired by games like Else Heart.break(), Hacknet, Uplink, and Deus Ex, Bitburner is a programming-based idle incremental RPG where you, 
the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be 
changed through coding and solved or automated in whatever way you find suitable."

autoPlant.js: (Requires 6.8 RAM) The main script! Compiles and keeps a list of all servers. Provides root access to any servers the player can access (hacker level is high enough, and player has enough port-breakers for), and 'plants' auto-hacking scripts on them as appropriate. Note that in this iteration, every server more or less just hacks itself. Has an optional 'Raze' argument that uses the player's (hopefully more powerful) home server to lower the security on every server in the main list to prepare them for more expedient hacking.

plantSeed.js: Uses any available port breakers on target server, nukes it, and copies the 'hackSeed' script onto it. This one can also be run by itself with arguments for: target server (where the hacking script will be running) and 'target's target' (the server that the script will be hacking).

hackSeed.js: After being placed on a server, this evaluates the hacking server's RAM, and the target's money/security threshholds, and runs our basic hacking loop script using that information.

basicHackLoop.js: Using threshholds provided from hackSeed, weaken, grow, or hack (in that order) target server depending on status.

justWeaken.js: A script with only one line! Minimal to save on RAM, used by the 'Raze mode' of autoPlant.

lowRamSimpleHack.js: For servers with lower RAM, that can't handle the hackSeed script. Just calculates its own threshholds (but since it's bigger in RAM than the basic hack loop, it's not as efficient ultimately.)
