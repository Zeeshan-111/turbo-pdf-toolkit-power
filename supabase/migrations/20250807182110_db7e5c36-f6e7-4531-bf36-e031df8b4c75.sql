
-- Fix critical PII exposure by adding proper RLS policies for the suggestions table
-- Currently anyone can potentially access customer suggestions data

-- Add policy to allow only authenticated admin users to view suggestions
-- For now, we'll restrict SELECT access completely until proper admin roles are implemented
CREATE POLICY "Only system can view suggestions" 
ON public.suggestions 
FOR SELECT 
USING (false); -- This prevents all SELECT access for now

-- Update existing insert policies to be more specific
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.suggestions;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.suggestions;

-- Create a single, more secure insert policy
CREATE POLICY "Allow suggestion submissions" 
ON public.suggestions 
FOR INSERT 
WITH CHECK (
  -- Ensure message is not empty and has reasonable length limits
  message IS NOT NULL 
  AND length(trim(message)) > 0 
  AND length(message) <= 5000
);

-- Add data retention consideration - delete suggestions older than 2 years
-- This helps with privacy compliance
CREATE OR REPLACE FUNCTION public.cleanup_old_suggestions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.suggestions 
  WHERE submitted_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled cleanup (this would need to be set up as a cron job in production)
-- For now, we just create the function - the actual scheduling would be done via pg_cron or external scheduler
