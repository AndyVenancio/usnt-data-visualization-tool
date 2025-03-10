import { useState, useEffect } from "react";
import React from "react";
import type { Player } from "../types/Player";
import { getPlayerData } from "../utils/csv-handler";
import { getTopStats } from "../utils/get-stat";
import { getAgeInYears } from "../utils/get-stat";
import PlayerRow from "../components/player-row";
import PlayerRadarChart from "../components/player-radar-chart";
import PlayerStatsIndividual from "../components/player-stats-individual";
import ComparisonGraph from "../components/comparison-graph";

function Players(): React.JSX.Element {
  const [players, setPlayers] = useState<Player[]>([]);
  const [topStats, setTopStats] = useState<{
    [player_name: string]: [string, number, string, number][];
  }>({});
  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(
    undefined
  );
  const [section, setSection] = useState<string>(""); // Used to determine whether we are showing players, a specific player, or a comparison
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]); // Max 2 players for comparison

  useEffect(() => {
    const fetchData = async () => {
      const playerData = await getPlayerData();
      setPlayers(playerData);
      const topStatsData = playerData.map((player: Player) => {
        const topStats = getTopStats(player);
        return [player.player_name, topStats];
      });
      setTopStats(Object.fromEntries(topStatsData));
    };
    fetchData();
    setSection("players");
  }, []);

  const getPosition = (player: Player): string => {
    const abv = player.position_general.split("_")[0].toUpperCase();
    const num = "(" + player.position_general.split("_")[1] + ")";
    return abv + " " + num;
  };

  const onClickPlayer = (player: Player) => {
    setCurrentPlayer(player);
    setSection("single-player");
  };

  const onClickPlayersButton = () => {
    setSection("players");
    setSelectedPlayers([]);
    setCurrentPlayer(undefined);
  };

  const onClickCompareButton = () => {
    setSection("compare");
    setSelectedPlayers([]);
    setCurrentPlayer(undefined);
  };

  const selectingPlayer = (player: Player) => {
    if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, player]);
    } else {
      alert("You can only compare 2 players at a time");
    }
  };

  const deselectingPlayer = (player: Player) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
  };

  const onClickComparePlayers = () => {
    if (selectedPlayers.length === 2) {
      setCurrentPlayer(undefined);
      setSection("comparing");
    } else {
      alert("You must select 2 players to compare");
    }
  };

  // Note: when routing to a specific player, the route must include the player name with a dash instead of a space
  // e.g. /players/Player-Name
  return (
    // Outline
    // Page Heading with title "Scouting App"
    // Player List with Player Rows
    // Player Rows are clickable and link to the player page
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Page Heading */}
      <nav className="flex flex-col border-b border-gray-200 bg-white shadow-2xs p-3">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-3xl font-bold">Scouting App</h1>
          <div className="flex flex-row items-center justify-center space-x-6">
            <button
              className="px-6 py-2 transition delay-100 duration-250 ease-in-out hover:scale-110 text-sm text-center font-bold text-black hover:text-gray-800 size-auto border border-emerald-500 rounded bg-emerald-400 shadow"
              onClick={onClickCompareButton}
            >
              Compare Mode
            </button>
            <button
              className="px-6 py-2 transition delay-100 duration-250 ease-in-out hover:scale-110 text-sm text-center font-bold text-black hover:text-gray-800 size-auto border border-emerald-500 rounded bg-emerald-400 shadow"
              onClick={onClickPlayersButton}
            >
              Players
            </button>
          </div>
        </div>
      </nav>

      {/* Player List */}
      <div
        className={`flex flex-col items-center justify-center w-full p-4 transition-all ease-in-out duration-800 delay-200 transform ${
          section === "players" || section === "compare"
            ? "opacity-100 translate-y-0 scale-y-100"
            : "opacity-0 translate-y-10 scale-y-0 absolute top-0 left-0 origin-top pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center w-full p4">
          <div className="flex flex-col items-center justify-evenly w-full max-w-4xl p-4">
            <div className="flex flex-col w-full bg-white shadow-md rounded-lg">
              <div className="relative flex w-full border-b border-gray-200 bg-emerald-400 p-4">
                <span className="text-lg font-bold">Players</span>
                <span className="absolute left-[70%] transform -translate-x-1/2 text-lg font-bold">
                  Top 2 Stats
                </span>
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
                    onClickPlayer={onClickPlayer}
                    comparing={section === "compare"}
                    selectingPlayer={selectingPlayer}
                    deselectingPlayer={deselectingPlayer}
                    selected={selectedPlayers.includes(player)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {section === "compare" && (
          <button
            className="px-6 py-2 transition delay-100 duration-250 ease-in-out hover:scale-110 text-sm text-center font-bold text-black hover:text-gray-800 border border-emerald-500 rounded bg-emerald-400 shadow"
            onClick={onClickComparePlayers}
          >
            Compare! {selectedPlayers.length}/2 Selected
          </button>
        )}
      </div>

      {/* Player Individual Statistics */}
      <div
        className={`flex flex-row items-center w-full transition-all ease-in delay-500 duration-800 ${
          section === "single-player"
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-1/2 h-max transition-all ease-in-out duration-700 dela-500 transform ${
            section === "single-player"
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10"
          }`}
        >
          {currentPlayer && <PlayerStatsIndividual player={currentPlayer!} />}
        </div>

        <div
          className={`w-1/2 transition-all ease-in-out duration-700 dela-500 transform ${
            section === "single-player"
              ? "opacity-100 -translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          {currentPlayer && <PlayerRadarChart player={currentPlayer!} />}
        </div>
      </div>

      {/* Player Comparison */}
      <div
        className={`flex flex-col items-center w-full transition-all ease-in-out delay-500 duration-800 ${
          section === "comparing"
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-row items-center justify-center w-full p-4">
          {section === "comparing" && (
            <PlayerStatsIndividual player={selectedPlayers[0]} />
          )}

          {section === "comparing" &&
            selectedPlayers[0].competition_name ===
              selectedPlayers[1].competition_name && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="green"
                className="size-15"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            )}

          {section === "comparing" &&
            selectedPlayers[0].competition_name !==
              selectedPlayers[1].competition_name && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="size-15"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9"
                />
              </svg>
            )}

          {section === "comparing" && (
            <PlayerStatsIndividual player={selectedPlayers[1]} />
          )}
        </div>

        <div className="flex flex-row items-center justify-center w-full p-4">
          {section === "comparing" && (
            <ComparisonGraph players={selectedPlayers} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Players;
