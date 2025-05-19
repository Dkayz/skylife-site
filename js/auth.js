// auth.js - Funções de autenticação para o painel administrativo
import { supabase } from './supabase.js';

// Função para registrar um novo usuário
export async function signUp(email, password, name, role = 'user') {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    });

    if (authError) throw authError;

    const sessionRes = await supabase.auth.getSession();
    const userId = sessionRes.data?.session?.user?.id;
    if (!userId) throw new Error('Sessão não encontrada após cadastro.');

    const { error: staffError } = await supabase
      .from('staff')
      .insert([{
        user_id: userId,
        name,
        email,
        role
      }]);

    if (staffError) throw staffError;

    return { success: true, user: authData.user };
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return { success: false, error: error.message };
  }
}

// Função para fazer login
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, error: error.message };
  }
}

// Função para fazer logout
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { success: false, error: error.message };
  }
}

// Função para verificar se o usuário está autenticado
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (data && data.user) {
      // Busca informações adicionais do staff
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
        
      if (staffError) throw staffError;
      
      return { 
        success: true, 
        user: data.user,
        staff: staffData
      };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return { success: false, error: error.message };
  }
}

// Função para recuperar senha
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://seu-site.vercel.app/admin/reset-password',
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    return { success: false, error: error.message };
  }
}

// Função para atualizar senha
export async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return { success: false, error: error.message };
  }
}
