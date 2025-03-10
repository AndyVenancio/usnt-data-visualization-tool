// This file is specifically for cleaning the data for the any of the charts
import { Player } from "../types/Player";
import { translateStatName } from "./stat-name-translation";

// Returns the only the percentile value of all the player stats (Anything ending with "_percentile")
export const cleanDataRadar = (
  player: Player
): { axis: string; value: number }[] => {
  return Object.entries(player)
    .filter(
      ([key, value]) => key.endsWith("_percentile") && typeof value === "number"
    ) // Ensure valid percentile data
    .map(([key, value]) => ({
      axis: translateStatName(key.replace("_percentile", "")),
      value: value as number,
    }));
};

// Get the raw data for the player stats (Anything not ending with "_percentile"
export const cleanDataComparison = (
    players: Player[]
  ): { player_name: string; stats: { key: string; value: number }[] }[] => {
    return players.map((player) => ({
      player_name: player.player_name,
      stats: Object.entries(player)
        .filter(([key, value]) => !key.endsWith("_percentile") && typeof value === "number" && key !== "season_name")
        .map(([key, value]) => ({ key: translateStatName(key), value: key.includes('percentage') ?  (value as number) * 100 : value as number })),
    }));
  }
