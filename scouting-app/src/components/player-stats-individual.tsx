import React from "react";
import { translateStatName } from "../utils/stat-name-translation";
import IndividualStat from "./individual-stat";
import { Player } from "../types/Player";
import { getAgeInYears, getCleanPosition } from "../utils/top-stats";

interface PlayerStatsIndividualProps {
    player: Player;
}

const PlayerStatsIndividual: React.FC<PlayerStatsIndividualProps> = ({ player }) => {
    return (

        <div className="flex flex-col items-center justify-center w-full p-4 border-b border-gray-200 shadow-sm">
            <div className="flex flex-row items-center w-full">
                <div className="flex flex-col">
                    <span className="text-5xl font-bold pb-2">{player.player_name} | {getCleanPosition(player)}</span>
                    <span className="text-xl text-gray-500">{getAgeInYears(player)} years</span>
                    <span className="text-lg text-gray-500">{player.competition_name} - {player.team_name} </span>
                </div>

                

            </div>
        </div>
    )
}

export default PlayerStatsIndividual;