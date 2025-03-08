"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerData = void 0;
var fs = require("fs");
var Papa = require("papaparse");
var getPlayerData = function () {
    // Read the CSV file
    var file = fs.readFileSync('../public/sample_uswnt_cm_data.csv', 'utf8');
    // Using PapaParse to parse the CSV file into a PLyer type array
    // Note: This assumes the CSV has header that matches the Player properties
    var parsed = Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    });
    return parsed.data;
};
exports.getPlayerData = getPlayerData;
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
