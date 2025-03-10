import React from "react";

interface IndividualStatProps {
    statValue: number;
    statName: string;
    statPercentile: number;
    statPer90: number;
}

const IndividualStat: React.FC<IndividualStatProps> = ({ statValue, statName, statPercentile, statPer90 }) => {
    return (
        <div className="flex flex-col items-center justify-center px-4">
            <div className="flex flex-row items-baseline space-x-1">
                <h1 className="text-xl font-bold">{statPercentile}th</h1>
                <span className="text-sm text-gray-600">|</span>
                <h1 className="text-sm text-bold text-gray-600">{statPer90}</h1>
                <p className="text-xs text-gray-600">(per 90)</p>
            </div> 
            <span className="text-sm text-gray-600">{statValue} {statName}</span>
        </div>
    )
}

export default IndividualStat;