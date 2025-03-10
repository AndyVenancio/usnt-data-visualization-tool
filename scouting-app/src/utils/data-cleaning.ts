import { Player } from "../types/Player";
import { translateStatName } from "./stat-name-translation";

// Returns the only the percentile value of all the player stats (Anything ending with "_percentile")
export const cleanDataRadar = (player: Player): { axis: string; value: number }[] => {
    return Object.entries(player)
      .filter(([key, value]) => key.endsWith("_percentile") && typeof value === "number") // Ensure valid percentile data
      .map(([key, value]) => ({
        axis: translateStatName(key.replace("_percentile", "")), // Transform the key into a readable name
        value: value as number,
      }));
  };
  
