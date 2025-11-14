import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rotzslksbszhffldlsjf.supabase.co' // Paste your Project URL here
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdHpzbGtzYnN6aGZmbGRsc2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTkyOTgsImV4cCI6MjA3ODY5NTI5OH0.i8k7zyO5uw8QhM1I4laTYKbHeftWTaCxHXbOHKIHlV0' // Paste your anon (public) key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey)