import * as Papa from 'papaparse';
import { Player } from '../types/Player';

export const getPlayerData = async (): Promise<Player[]> => {
    // Explicit incase of change in file path
    const filePath = '/sample_uswnt_cm_data.csv';

    const response = await fetch(filePath);
    const text = await response.text();
    // Assumes the CSV format for future data is consistent
    const results = Papa.parse<Player>(text, {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
    })

    return results.data;
}

export const getSinglePlayerData = async (playerName: string | undefined): Promise<Player | undefined> => {
    if (!playerName) return undefined;

    const players = await getPlayerData();

    // Reconstruct player name to match CSV format (switching spaces to dashes)
    const formattedPlayerName = playerName.replace(/-/g, ' ' );

    // Find the player by name
    const player = players.find((player: Player) => player.player_name === formattedPlayerName);

    return player;
} 

// IN CASE OF LARGE CSV FILES (Need to fix to use fetch instead of fs)
// export const parseLargeCSV = async (): Promise<Player[]> => {
//     const response = await fetch('/sample_uswnt_cm_data.csv'); // Fetch the CSV file
//     const reader = response.body?.getReader(); // Get the ReadableStream
//     if (!reader) throw new Error("Failed to get reader from response");
// 
//     const textDecoder = new TextDecoder(); // To decode incoming stream chunks
//     let csvData = "";
// 
//     while (true) {
//         const { value, done } = await reader.read(); // Read chunks of the stream
//         if (done) break;
//         csvData += textDecoder.decode(value, { stream: true }); // Append decoded text
//     }
// 
//     return new Promise((resolve, reject) => {
//         Papa.parse<Player>(csvData, {
//             header: true,
//             dynamicTyping: true,
//             skipEmptyLines: true,
//             complete: (result) => resolve(result.data),
//             error: (error) => reject(error),
//         });
//     });
// };


