// staff.js - Funções para gerenciamento de staff
import { supabase } from './supabase.js';

// Função para buscar todos os membros da equipe
export async function getAllStaff() {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return { success: true, staff: data };
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    return { success: false, error: error.message };
  }
}

// Função para buscar um membro específico da equipe
export async function getStaffById(staffId) {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', staffId)
      .single();
      
    if (error) throw error;
    
    return { success: true, staffMember: data };
  } catch (error) {
    console.error('Erro ao buscar membro da equipe:', error);
    return { success: false, error: error.message };
  }
}

// Função para atualizar um membro da equipe
export async function updateStaff(staffId, staffData) {
  try {
    const { data, error } = await supabase
      .from('staff')
      .update(staffData)
      .eq('id', staffId)
      .select();
      
    if (error) throw error;
    
    return { success: true, staffMember: data[0] };
  } catch (error) {
    console.error('Erro ao atualizar membro da equipe:', error);
    return { success: false, error: error.message };
  }
}

// Função para excluir um membro da equipe
export async function deleteStaff(staffId) {
  try {
    // Primeiro, verifica se o usuário existe no Auth
    const { data: staffData, error: fetchError } = await supabase
      .from('staff')
      .select('user_id')
      .eq('id', staffId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Remove da tabela staff
    const { error: deleteError } = await supabase
      .from('staff')
      .delete()
      .eq('id', staffId);
      
    if (deleteError) throw deleteError;
    
    // Se houver um user_id associado, remove o usuário do Auth
    if (staffData.user_id) {
      // Esta operação geralmente requer função Admin no Supabase
      // Você pode implementar isso usando Supabase Edge Functions
      console.log('Usuário Auth associado:', staffData.user_id);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir membro da equipe:', error);
    return { success: false, error: error.message };
  }
}

// Função para buscar logs de atividade
export async function getActivityLogs(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*, staff(name)')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return { success: true, logs: data };
  } catch (error) {
    console.error('Erro ao buscar logs de atividade:', error);
    return { success: false, error: error.message };
  }
}

// Função para registrar uma atividade
export async function logActivity(staffId, action, details) {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([
        {
          staff_id: staffId,
          action,
          details
        }
      ]);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    return { success: false, error: error.message };
  }
}

// Função para verificar permissões de um membro da equipe
export async function checkPermission(staffId, permission) {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('permissions, role')
      .eq('id', staffId)
      .single();
      
    if (error) throw error;
    
    // Se for admin, tem todas as permissões
    if (data.role === 'admin') return { success: true, hasPermission: true };
    
    // Verifica se a permissão específica existe no array de permissões
    const hasPermission = data.permissions.includes(permission) || data.permissions.includes('all');
    
    return { success: true, hasPermission };
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return { success: false, error: error.message };
  }
}
