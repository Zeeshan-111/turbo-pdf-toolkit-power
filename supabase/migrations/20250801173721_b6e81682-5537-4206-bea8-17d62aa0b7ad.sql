
-- Create the suggestions table
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert suggestions
CREATE POLICY "Allow anonymous insert"
ON public.suggestions
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert suggestions as well
CREATE POLICY "Allow authenticated insert"
ON public.suggestions
FOR INSERT
TO authenticated
WITH CHECK (true);
