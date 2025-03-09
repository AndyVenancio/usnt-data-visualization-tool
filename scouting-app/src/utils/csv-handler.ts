import * as fs from 'fs';
import * as Papa from 'papaparse';
import { Player } from '../types/Player';

export const getPlayerData = (): Player[] => {
    // Read the CSV file
    const file = fs.readFileSync('../public/sample_uswnt_cm_data.csv', 'utf8')

    // Using PapaParse to parse the CSV file into a PLyer type array
    // Note: This assumes the CSV has header that matches the Player properties
    const parsed = Papa.parse<Player>(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    });

    return parsed.data;
}

export const getSinglePlayerData = (playerName: string | undefined): Player | undefined => {
    if (!playerName) return undefined;
    const players = getPlayerData();
    // Reconstruct player name to match CSV format (switching spaces to dashes)
    const formattedPlayerName = playerName.replace(/-/g, ' ' );
    // Find the player by name
    const player = players.find((player: Player) => player.player_name === formattedPlayerName);
    return player;
} 

// IN CASE OF LARGE CSV FILES
// export const parseLargeCSV = (): Promise<Player[]> => {
//     return new Promise((resolve, reject) => {
//         const filePath = '../public/sample_uswnt_cm_data.csv';  // Explicit file path
//         const players: Player[] = [];
// 
//         const stream = fs.createReadStream(filePath, 'utf8');
// 
//         Papa.parse<Player>(stream, {
//             dynamicTyping: true,
//             header: true,
//             skipEmptyLines: true,
//             complete: () => {
//                 resolve(players);  // Return the accumulated players array when parsing is complete
//             },
//             error: (error) => {
//                 reject(error);  
//             },
//             step: (results) => {
//                 players.push(results.data as Player);  // Accumulate the data into the players array
//             },
//         });
//     });
// };

