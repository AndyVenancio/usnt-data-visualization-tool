// Note: We are only going to get the top two stats for a giver player and return them in a list
import type { Player } from '../types/Player';

export function getTopStats(player: Player): [keyof Player, number, keyof Player, number][] {
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
    return sortedStats.slice(0, 2).map(stat => [stat.percentileKey, stat.percentileValue, stat.rawKey, stat.rawValue.toFixed(2) as unknown as number]);
}

export function getAgeInYears(player: Player) : number {
        const birthDate = new Date(player.birth_date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }

export function getCleanPosition(player: Player) : string {
    const abv = player.position_general.split("_")[0].toUpperCase();
    const num = "(" + player.position_general.split("_")[1] + ")";
    return abv + " " + num;
}