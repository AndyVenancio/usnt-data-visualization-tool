import React from "react";
import { useParams } from "react-router";
import { Player } from "../types/Player";
import { getSinglePlayerData } from "../utils/csv-handler";
import { translateStatName } from "../utils/stat-name-translation";

function PlayerStats(): React.JSX.Element {
    const { player_name } = useParams<{ player_name: string }>();
    // Replace dashed with whitespace to match CSV format
    const formattedPlayerName = player_name?.replace(/-/g, ' ');
    const player: Player | undefined = getSinglePlayerData(formattedPlayerName);

    if (!player) {
        return <div>Player Not Found!</div>
    }


}

export default PlayerStats;

