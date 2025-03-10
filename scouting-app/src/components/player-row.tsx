import React from "react";
//import { Link } from "react-router"; Link to={`/players/${player_name.replace(/\s+/g, "-")}`}
import { translateStatName } from "../utils/stat-name-translation";
import { Player } from "../types/Player";

interface PlayerRowProps {
    player: Player;
    player_name: string;
    age_in_years: number;
    competition_name: string;
    position_general: string;
    topStats: [string, number, string, number][];
    onClickPlayer: (player_name: Player) => void;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, player_name, age_in_years, competition_name, position_general, topStats, onClickPlayer}) => {
    return (
        // Outline
        // Player Row with all props
        // Player Row must react to hover
        // Clicking on the row links to the player page

        <div className="flex flex-col items-center justify-center w-full p-4 border-b border-gray-200 hover:bg-gray-100" onClick={() => onClickPlayer(player)}>
            <div className="flex flex-row items-center w-full">

                <div className="flex flex-col w-2/5">
                    <span className="text-lg font-bold">{player_name}</span>
                    <span className="text-sm text-gray-500">{age_in_years} years | {competition_name} | {position_general}</span>
                </div>

                <div className="flex flex-row w-3/5 justify-evenly">
                    <div className="flex flex-col items-center justify-center px-4">
                        <div className="flex flex-row items-baseline space-x-1">
                            <h1 className="text-xl font-bold">{topStats[0][1]}th</h1>
                            <span className="text-sm text-gray-600">|</span>
                            <h1 className="text-sm text-bold text-gray-600">{topStats[0][3]}</h1>
                            <p className="text-xs text-gray-600">(per 90)</p>
                        </div> 
                        <span className="text-sm text-gray-600">{translateStatName(topStats[0][2])}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center px-4">
                        <div className="flex flex-row items-baseline space-x-1">
                            <h1 className="text-xl font-bold">{topStats[1][1]}th</h1>
                            <span className="text-sm text-gray-600">|</span>
                            <h1 className="text-sm text-bold text-gray-600">{topStats[1][3]}</h1>
                            <p className="text-xs text-gray-600">(per 90)</p>
                        </div> 
                        <span className="text-sm text-gray-600">{translateStatName(topStats[1][2])}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PlayerRow;