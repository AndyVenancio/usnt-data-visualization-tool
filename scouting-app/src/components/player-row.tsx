import React from "react";
import { Link } from "react-router-dom";
import { translateStatName } from "../utils/stat-name-translation";

interface PlayerRowProps {
    player_name: string;
    birth_date: string;
    competition_name: string;
    position_general: string;
    topStats: [string, number, string, number][];
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player_name, birth_date, competition_name, position_general, topStats}) => {
    return (
        // Outline
        // Player Row with all props
        // Player Row must react to hover
        // Clicking on the row links to the player page


    )
}

export default PlayerRow;