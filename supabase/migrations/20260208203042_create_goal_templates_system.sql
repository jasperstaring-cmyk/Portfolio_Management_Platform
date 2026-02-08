/*
  # Create Goal Templates System

  1. New Tables
    - `goal_templates`
      - `id` (uuid, primary key)
      - `name` (text) - Template name (e.g., "Retirement Planning", "Capital Preservation")
      - `description` (text)
      - `goal_type` (text) - 'accumulation' or 'preservation'
      - `icon` (text) - emoji icon for UI
      - `is_active` (boolean) - whether template is available for use
      - `category` (text) - e.g., 'Retirement', 'Education', 'Wealth', 'Emergency'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
      Default field values for accumulation:
      - `default_initial_investment` (numeric)
      - `default_monthly_contribution` (numeric)
      - `default_time_horizon_years` (integer)
      - `default_target_amount` (numeric)
      
      Default field values for preservation:
      - `default_current_portfolio_value` (numeric)
      - `default_inflation_benchmark` (numeric)
      - `default_target_excess_return` (numeric)
      - `default_max_allowable_drawdown` (numeric)
      
      Common fields:
      - `default_expected_return` (numeric)
      - `suggested_risk_level` (text)

  2. Update goals table
    - Add `goal_template_id` to reference the template used

  3. Security
    - Enable RLS on `goal_templates` table
    - Add policies for authenticated users

  4. Insert Default Templates
    - Add professional goal templates for common scenarios
*/

CREATE TABLE IF NOT EXISTS goal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  goal_type text NOT NULL CHECK (goal_type IN ('accumulation', 'preservation')),
  icon text DEFAULT '🎯',
  is_active boolean DEFAULT true,
  category text,
  
  default_initial_investment numeric,
  default_monthly_contribution numeric,
  default_time_horizon_years integer,
  default_target_amount numeric,
  
  default_current_portfolio_value numeric,
  default_inflation_benchmark numeric DEFAULT 3.0,
  default_target_excess_return numeric DEFAULT 2.0,
  default_max_allowable_drawdown numeric DEFAULT 20.0,
  
  default_expected_return numeric DEFAULT 5.0,
  suggested_risk_level text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goal_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active goal templates"
  ON goal_templates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all goal templates"
  ON goal_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert goal templates"
  ON goal_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update goal templates"
  ON goal_templates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete goal templates"
  ON goal_templates
  FOR DELETE
  TO authenticated
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'goals' AND column_name = 'goal_template_id'
  ) THEN
    ALTER TABLE goals ADD COLUMN goal_template_id uuid REFERENCES goal_templates(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_goal_templates_category ON goal_templates(category);
CREATE INDEX IF NOT EXISTS idx_goal_templates_type ON goal_templates(goal_type);
CREATE INDEX IF NOT EXISTS idx_goal_templates_active ON goal_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_goals_template_id ON goals(goal_template_id);

INSERT INTO goal_templates (name, description, goal_type, icon, category, default_initial_investment, default_monthly_contribution, default_time_horizon_years, default_target_amount, default_expected_return, suggested_risk_level) VALUES
('Retirement Savings', 'Build wealth for retirement with systematic contributions', 'accumulation', '🏖️', 'Retirement', 50000, 2000, 25, 2000000, 6.0, 'Moderate'),
('College Education Fund', 'Save for future educational expenses', 'accumulation', '🎓', 'Education', 25000, 1000, 15, 300000, 5.5, 'Moderate'),
('Home Down Payment', 'Accumulate capital for real estate purchase', 'accumulation', '🏠', 'Home', 10000, 1500, 5, 100000, 4.5, 'Conservative'),
('Wealth Accumulation', 'Long-term wealth building strategy', 'accumulation', '📈', 'Wealth', 100000, 3000, 20, 3000000, 7.0, 'Aggressive'),
('Emergency Fund', 'Build financial safety net', 'accumulation', '💰', 'Emergency', 5000, 500, 2, 25000, 3.0, 'Very Conservative')
ON CONFLICT DO NOTHING;

INSERT INTO goal_templates (name, description, goal_type, icon, category, default_current_portfolio_value, default_inflation_benchmark, default_target_excess_return, default_max_allowable_drawdown, default_expected_return, suggested_risk_level) VALUES
('Capital Preservation', 'Protect existing wealth with minimal risk', 'preservation', '🛡️', 'Preservation', 1000000, 2.5, 1.5, 10.0, 4.0, 'Conservative'),
('Income Generation', 'Generate steady income while preserving capital', 'preservation', '💵', 'Income', 2000000, 3.0, 2.0, 15.0, 5.0, 'Moderate'),
('Wealth Management', 'Balance growth and preservation', 'preservation', '⚖️', 'Wealth', 5000000, 3.0, 2.5, 20.0, 6.0, 'Moderate'),
('Legacy Planning', 'Long-term wealth preservation for future generations', 'preservation', '🌳', 'Legacy', 10000000, 2.0, 1.0, 12.0, 4.5, 'Conservative')
ON CONFLICT DO NOTHING;
