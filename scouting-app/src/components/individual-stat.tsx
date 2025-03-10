import React from "react";

interface IndividualStatProps {
  statValue: number;
  statName: string;
  statPercentile: number;
}

const IndividualStat: React.FC<IndividualStatProps> = ({
  statValue,
  statName,
  statPercentile,
}) => {
  const colorGradient = (percentile: number): string => {
    if (percentile >= 90) return "bg-emerald-500";
    else if (percentile >= 75) return "bg-yellow-500";
    else if (percentile >= 50) return "bg-orange-500";
    else if (percentile >= 25) return "bg-red-500";
    else return "bg-gray-500";
  };
  const color = colorGradient(statPercentile);

  const statPercentage = () : number => {
    if (statName.includes("Percentage")) return statValue * 100;
    else return statValue;
  };

  return (
    <div className="flex flex-col items-center justify-center px-3">
      <div className="flex flex-row w-full justify-between items-end mb-2">
        <span className="text-sm text-gray-800 text-left underline underline-offset-3 decoration-gray-500">{statName}</span>
        <div className="flex flex-row items-baseline space-x-1">
            <span className="text-sm font-bold text-black text-right">
              {statPercentage().toFixed(2)}{statName.includes("Percentage") ? "%" : ""}
            </span>
            <span className="text-xs text-gray-600 text-right">(per 90)</span>
        </div>
        <span className="text-sm text-gray-600 text-right">
          {statPercentile}th
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
        <div
          className={`bg-emerald-500 h-2.5 rounded-full ${color}`}
          style={{ width: `${statPercentile}%` }}
        ></div>
      </div>
    </div>
  );
};

export default IndividualStat;
