// Note: We are only going to get the top two stats for a giver player and return them in a list
import type { Player } from '../types/Player';

export default function getTopStats(player: Player): [string, number, string, number][] {
    // Using the percentile values to determine the top stats
    const percentileStats: { percentileKey: keyof Player; rawKey: keyof Player; percentileValue: number; rawValue: number }[] = 
        Object.entries(player)
            .filter(([key, value]) => key.endsWith("_percentile") && typeof value === "number")
            .map(([percentileKey, percentileValue]) => {
                const rawKey = percentileKey.replace("_percentile", "") as keyof Player;
                const rawValue = typeof player[rawKey] === "number" ? (player[rawKey] as number) : 0;
                return { percentileKey: percentileKey as keyof Player, rawKey, percentileValue: percentileValue as number, rawValue };
            });

    const sortedStats = percentileStats.sort((a, b) => b.percentileValue - a.percentileValue);
    return sortedStats.slice(0, 2).map(stat => [stat.percentileKey, stat.percentileValue, stat.rawKey, stat.rawValue]);
}