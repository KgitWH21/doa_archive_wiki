-- Add is_member to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_member boolean NOT NULL DEFAULT false;

-- payments table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  stripe_payment_intent_id text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('succeeded', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = user_id);
