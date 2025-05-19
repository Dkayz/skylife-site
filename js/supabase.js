// Importando a biblioteca Supabase via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Configuração do cliente Supabase
const supabaseUrl = 'https://xvlgxxrkgrxsjxaoeqtd.supabase.co'; // Substitua pela sua URL do Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bGd4eHJrZ3J4c2p4YW9lcXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MjgzMDAsImV4cCI6MjA2MzIwNDMwMH0.muU0RYgxK68zuO9I-mKyoW7zBCT_5G-LWZMibORcfLU'; // Substitua pela sua chave anon do Supabase

// Criando o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey );

// Exportando o cliente para uso em outros arquivos
export { supabase };
