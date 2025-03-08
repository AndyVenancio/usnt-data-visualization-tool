import * as fs from 'fs';
import * as Papa from 'papaparse';

type Player = {
    player_name: string;
    birth_date: string;
    team_name: string;
    competition_name: string;
    season_name: string;
    position_general: string;
    progressive_pass: number;
    progressive_pass_percentile: number;
    final_third_entry_pass: number;
    final_third_entry_pass_percentile: number;
    pass_completion_pressure: number;
    pass_completion_pressure_percentile: number;
    pressure: number;
    pressure_percentile: number; 
    tackle: number;
    tackle_percentile: number;
    tackle_win_percentage: number;
    tackle_win_percentage_percentile: number;
    shot_assist_op: number;
    shot_assist_op_percentile: number;
    progressive_carry: number;
    progressive_carry_percentile: number
};

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

