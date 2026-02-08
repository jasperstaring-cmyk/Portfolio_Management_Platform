/*
  # Create Goal-Based Investing System

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `client_id` (text, reference to client)
      - `goal_name` (text)
      - `goal_type` (text) - 'accumulation' or 'preservation'
      - `status` (text) - 'active', 'completed', 'on-hold'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
      Accumulation fields:
      - `initial_investment` (numeric)
      - `monthly_contribution` (numeric)
      - `time_horizon_years` (integer)
      - `target_amount` (numeric)
      
      Preservation fields:
      - `current_portfolio_value` (numeric)
      - `inflation_benchmark` (numeric) - percentage
      - `target_excess_return` (numeric) - percentage
      - `max_allowable_drawdown` (numeric) - percentage
      
      Calculation fields:
      - `expected_return` (numeric) - default 5%
      - `feasibility_score` (numeric) - calculated score
      - `health_status` (text) - 'green', 'yellow', 'red'
      - `assigned_portfolio_id` (text)
      - `assigned_risk_profile_id` (text)

  2. Security
    - Enable RLS on `goals` table
    - Add policies for authenticated users to manage goals
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  goal_name text NOT NULL,
  goal_type text NOT NULL CHECK (goal_type IN ('accumulation', 'preservation')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
  
  initial_investment numeric,
  monthly_contribution numeric,
  time_horizon_years integer,
  target_amount numeric,
  
  current_portfolio_value numeric,
  inflation_benchmark numeric,
  target_excess_return numeric,
  max_allowable_drawdown numeric,
  
  expected_return numeric DEFAULT 5.0,
  feasibility_score numeric,
  health_status text CHECK (health_status IN ('green', 'yellow', 'red')),
  assigned_portfolio_id text,
  assigned_risk_profile_id text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete goals"
  ON goals
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_goals_client_id ON goals(client_id);
CREATE INDEX IF NOT EXISTS idx_goals_goal_type ON goals(goal_type);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
