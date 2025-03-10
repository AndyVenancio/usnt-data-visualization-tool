import React from "react";
import { translateStatName } from "../utils/stat-name-translation";
import IndividualStat from "./individual-stat";
import { Player } from "../types/Player";
import {
  getAgeInYears,
  getCleanPosition,
  getOnlyStatsNames,
} from "../utils/get-stat";

interface PlayerStatsIndividualProps {
  player: Player;
}

const PlayerStatsIndividual: React.FC<PlayerStatsIndividualProps> = ({
  player,
}) => {
  const playerStats: string[] = getOnlyStatsNames(player); // get only the stats names to call the component 
  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <div className="flex flex-row items-center w-full border-b border-gray-200 pb-4">
        <div className="flex flex-col">
          <div className="text-5xl font-bold pb-2">
            {player.player_name} | {getCleanPosition(player)}
          </div>
          <div className="text-xl text-gray-600">
            Born: {player.birth_date} | {getAgeInYears(player)} years old
          </div>
          <div className="text-xl text-gray-600">
            {player.competition_name} - {player.team_name}{" "}
          </div>
          <div className="text-lg text-gray-400">
            Showing statistics for the {player.season_name} season
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 w-full gap-4 pt-4">
        {playerStats.map((stat) => (
          <IndividualStat
            key={stat}
            statValue={player[stat] as number}
            statName={translateStatName(stat)}
            statPercentile={player[`${stat}_percentile`] as number}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerStatsIndividual;
