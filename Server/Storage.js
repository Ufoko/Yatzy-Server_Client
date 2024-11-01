let savePath = process.cwd() + "/Yatzy-Server_Client/Server/SaveFiles/Games.json"


/**
 * Reads the old file, appends the new game the json array, then resaves the file
 * @param {*} game The game to be saved
 */
export function saveGame(game) {
   
    let jsonData = loadJSON(); 


    jsonData.push(game); 
    
    saveJSON(jsonData); 
    console.log("New entry added");

}

/**
 * Function to get all stored games
 * @returns json file with all games
 */
export function loadGames(){
  return loadJSON();
}

/**
 * Private function, only to be called from inside Storage
 * Saves the data in a json file
 * @param {*} data data to be saved in json
 */
function saveJSON(data) {
    fs.writeFileSync(savePath, JSON.stringify(data, null, 2), 'utf8');
  }


  /**
   * Private function, only to be called from inside Storage
   * Loads the savegames.
   * It makes sure it's in an array type
   * @returns the savegames
   */
function loadJSON() {
    try {
    let fileContent = fs.readFileSync(savePath, 'utf8');
    let data = fileContent ? JSON.parse(fileContent) : []; //If filecontent is empty, initialze as [], otherwise use the parse
    return Array.isArray(data) ? data : []; // Safeguard to ensure is array. If the data is in array format, return the data, otherwise returns empty array
    } catch (err) {
    //  console.error("Could not parse JSON. Initializing empty data.");
      return {};
    }
  }



