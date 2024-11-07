These scripts are for the programming-based idle incremental game Bitburner ( https://store.steampowered.com/app/1812820/Bitburner/ )


autoPlant.js: Gets a list of all game servers, and handles cracking and hacking them as the player's hacking level and number of port breakers increases during game progression.

hackStarter.js: Copies autoHack.js to the host server, and initializes it with info to hack the target server (which is usually the same server as host).

autoHack.js: A relatively simple auto-hacking (and auto-growing and auto-weakening, of course) loop.

serverListBuilder.js: Builds a dictionary of all servers in the game, with convenient info like MaxMoney, and then exports via a port (default 20).

functionLibrary.js: A (small) library of functions, mostly used by the scripts listed above.
