// supabase.js - Configuração da conexão com o Supabase
import { createClient } from '@supabase/supabase-js';

// Estas variáveis devem ser substituídas pelas suas credenciais do Supabase
// Você encontrará estas informações no painel do Supabase em Settings > API
const supabaseUrl = 'https://sua-url-do-projeto.supabase.co';
const supabaseKey = 'sua-chave-anon-key-do-supabase';

// Cria o cliente do Supabase para uso em todo o site
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
