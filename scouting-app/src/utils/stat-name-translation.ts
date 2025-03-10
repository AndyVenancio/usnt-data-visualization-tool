// Note: This is under the assumption that these are all the stats that are used in the application.
// In the case of new stats being added, this function will need to be updated.

export const translateStatName = (stat: string): string => {
  const statNameMapping: { [key: string]: string } = {
    progressive_pass: "Progressive Pass",
    progressive_pass_percentile: "Progressive Pass Percentile",
    final_third_entry_pass: "Final Third Entry Pass",
    final_third_entry_pass_percentile: "Final Third Entry Pass Percentile",
    pass_completion_pressure: "Pass Completion Under Pressure",
    pass_completion_pressure_percentile:
      "Pass Completion Under Pressure Percentile",
    pressure: "Pressure",
    pressure_percentile: "Pressure Percentile",
    tackle: "Tackle",
    tackle_percentile: "Tackle Percentile",
    tackle_win_percentage: "Tackle Win Percentage",
    tackle_win_percentage_percentile: "Tackle Win Percentage Percentile",
    shot_assist_op: "Shot Assist Open Play",
    shot_assist_op_percentile: "Shot Assist Open Play Percentile",
    progressive_carry: "Progressive Carry",
    progressive_carry_percentile: "Progressive Carry Percentile",
  };

  // Return the cleaned stat name or the original if no match is found
  return statNameMapping[stat] || stat;
};
