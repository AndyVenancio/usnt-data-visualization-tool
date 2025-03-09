export type Player = {
    player_name: string;
    birth_date: string;
    team_name: string;
    competition_name: string;
    season_name: string;
    position_general: string;
    progressive_pass: number;
    progressive_pass_percentile: number;
    final_third_entry_pass: number;
    final_third_entry_pass_percentile: number;
    pass_completion_pressure: number;
    pass_completion_pressure_percentile: number;
    pressure: number;
    pressure_percentile: number; 
    tackle: number;
    tackle_percentile: number;
    tackle_win_percentage: number;
    tackle_win_percentage_percentile: number;
    shot_assist_op: number;
    shot_assist_op_percentile: number;
    progressive_carry: number;
    progressive_carry_percentile: number
};