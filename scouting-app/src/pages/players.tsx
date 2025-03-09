import { useState, useEffect } from "react";
import React from "react";
import type { Player } from "../types/Player";
import { translateStatName } from "../utils/stat-name-translation";
import { getPlayerData } from "../utils/csv-handler";
import { getTopStats } from "../utils/top-stats";
import PlayerRow from "../components/player-row";

function Players(): React.JSX.Element {
    const [players, setPlayers] = useState<Player[]>([]);
    const [topStats, setTopStats] = useState<{
        [player_name: string]: [string, number, string, number][];
    }>({});

    useEffect(() => {
        const playerData = getPlayerData();
        setPlayers(playerData);
        const topStatsData = playerData.map((player: Player) => {
            const topStats = getTopStats(player);
            return [player.player_name, topStats];
        });
        setTopStats(Object.fromEntries(topStatsData));
    }, [])

    const getPosition = (player: Player) : string => {
        const abv = player.position_general.split("_")[0].toUpperCase();
        const num = "(" + player.position_general.split("_'")[1] + ")";
        return abv + " " + num;
    }

    const getAgeInYears = (player: Player) : number => {
        const birthDate = new Date(player.birth_date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }

    // Note: when routing to a specific player, the route must include the player name with a dash instead of a space
    // e.g. /players/Player-Name
    return (
        // Outline
        // Page Heading with title "Scouting App"
        // Player List with Player Rows
        // Player Rows are clickable and link to the player page



    )
}

export default Players;