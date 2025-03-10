import { useState, useEffect } from "react";
import React from "react";
import type { Player } from "../types/Player";
import { getPlayerData } from "../utils/csv-handler";
import { getTopStats } from "../utils/top-stats";
import { getAgeInYears } from "../utils/top-stats";
import PlayerRow from "../components/player-row";
import PlayerRadarChart from "../components/player-radar-chart";
import PlayerStatsIndividual from "../components/player-stats-individual";

function Players(): React.JSX.Element {
    const [players, setPlayers] = useState<Player[]>([]);
    const [topStats, setTopStats] = useState<{
        [player_name: string]: [string, number, string, number][];
    }>({});
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(undefined);
    const [section, setSection] = useState<string>("") // Used to determine whether we are showing players, a specific player, or a comparison
    const [secondPlayer, setSecondPlayer] = useState<Player | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const playerData = await getPlayerData();
            setPlayers(playerData);
            const topStatsData = playerData.map((player: Player) => {
                const topStats = getTopStats(player);
                return [player.player_name, topStats];
            });
            setTopStats(Object.fromEntries(topStatsData));
        }
        fetchData();
        setSection("players");
    }, [])

    const getPosition = (player: Player) : string => {
        const abv = player.position_general.split("_")[0].toUpperCase();
        const num = "(" + player.position_general.split("_")[1] + ")";
        return abv + " " + num;
    }

    const onClickPlayer = (player: Player) => {
        setCurrentPlayer(player);
        setSection("single-player");
    }
    
    const onClickPlayersButton = () => {
        setSection("players");
        setCurrentPlayer(undefined);
        setSecondPlayer(undefined);
    }

    // Note: when routing to a specific player, the route must include the player name with a dash instead of a space
    // e.g. /players/Player-Name
    return (
        // Outline
        // Page Heading with title "Scouting App"
        // Player List with Player Rows
        // Player Rows are clickable and link to the player page
        <div className="flex flex-col w-full min-h-screen bg-gray-50">

        <nav className="flex flex-col border-b border-gray-200 bg-white shadow p-3">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-3xl font-bold">Scouting App</h1>
                <div className="flex flex-row items-center justify-center space-x-6">
                    <button className="px-6 py-2 transition delay-100 duration-250 ease-in-out hover:scale-110 text-sm text-center font-bold text-black hover:text-gray-800 size-auto border border-emerald-500 rounded bg-emerald-400 shadow">
                        Compare
                    </button>
                    <button className="px-6 py-2 transition delay-100 duration-250 ease-in-out hover:scale-110 text-sm text-center font-bold text-black hover:text-gray-800 size-auto border border-emerald-500 rounded bg-emerald-400 shadow" onClick={onClickPlayersButton}>
                        Players
                    </button> 
                </div>          
            </div>
        </nav>

        <div className={`flex flex-col items-center justify-center w-full p-4 transition-all ease-in duration-800 transform ${section === "players" ? "opacity-100 translate-y-0 scale-y-100" : "opacity-0 translate-y-10 scale-y-0 absolute top-0 left-0 origin-top pointer-events-none"}`}>
            <div className="flex flex-col items-center justify-center w-full p4">
                <div className="flex flex-col items-center justify-evenly w-full max-w-4xl p-4">
                    <div className="flex flex-col w-full bg-white shadow-md rounded-lg">
                        <div className="relative flex w-full border-b border-gray-200 bg-emerald-400 p-4">
                            <span className="text-lg font-bold">Players</span>
                            <span className="absolute left-[70%] transform -translate-x-1/2 text-lg font-bold">Top 2 Stats</span>
                        </div>
                        <div className="flex flex-col w-full">
                            {players.map((player) => (
                                <PlayerRow 
                                key={player.player_name}
                                player={player}
                                player_name={player.player_name} 
                                age_in_years={getAgeInYears(player)} 
                                competition_name={player.competition_name} 
                                position_general={getPosition(player)} 
                                topStats={topStats[player.player_name]} 
                                onClickPlayer={onClickPlayer}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className={`flex flex-row items-center w-full transition-all ease-in delay-500 duration-800 ${section === "single-player" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {/* Player Stats (Moves from Left to Center) */}
            <div className={`w-1/2 transition-all ease-in duration-700 transform ${section === "single-player" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                { currentPlayer &&
                    <PlayerStatsIndividual player={currentPlayer!} />
                }
            </div>

            {/* Radar Chart (Moves from Right to Center) */}
            <div className={`w-1/2 transition-all ease-in duration-700 transform ${section === "single-player" ? "opacity-100 -translate-x-0" : "opacity-0 translate-x-10"}`}>
                { currentPlayer &&
                    <PlayerRadarChart player={currentPlayer!} />
                }
            </div>
        </div>

        </div>

    )
}

export default Players;