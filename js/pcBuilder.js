// pcBuilder.js - Funções para o montador de PC
import { supabase } from './supabase.js';

// Função para buscar todos os componentes de uma categoria
export async function getComponentsByType(componentType) {
  try {
    const { data, error } = await supabase
      .from('pc_components')
      .select('*')
      .eq('type', componentType)
      .order('price');
      
    if (error) throw error;
    
    return { success: true, components: data };
  } catch (error) {
    console.error(`Erro ao buscar componentes do tipo ${componentType}:`, error);
    return { success: false, error: error.message };
  }
}

// Função para calcular compatibilidade entre componentes
export function checkCompatibility(selectedComponents) {
  const issues = [];
  
  // Verifica compatibilidade entre CPU e placa-mãe
  if (selectedComponents.cpu && selectedComponents.motherboard) {
    const cpu = selectedComponents.cpu;
    const motherboard = selectedComponents.motherboard;
    
    if (cpu.socket !== motherboard.socket) {
      issues.push(`O processador ${cpu.name} não é compatível com a placa-mãe ${motherboard.name}. Sockets diferentes: ${cpu.socket} vs ${motherboard.socket}`);
    }
  }
  
  // Verifica se a fonte tem potência suficiente
  if (selectedComponents.psu && Object.keys(selectedComponents).length > 1) {
    const psu = selectedComponents.psu;
    let totalPower = 0;
    
    // Soma o consumo de energia de cada componente
    for (const type in selectedComponents) {
      if (type !== 'psu') {
        totalPower += selectedComponents[type].power_consumption || 0;
      }
    }
    
    // Adiciona 20% de margem de segurança
    const recommendedPower = totalPower * 1.2;
    
    if (psu.wattage < recommendedPower) {
      issues.push(`A fonte de ${psu.wattage}W pode ser insuficiente para esta configuração. Recomendamos pelo menos ${Math.ceil(recommendedPower)}W.`);
    }
  }
  
  // Verifica compatibilidade de RAM com a placa-mãe
  if (selectedComponents.ram && selectedComponents.motherboard) {
    const ram = selectedComponents.ram;
    const motherboard = selectedComponents.motherboard;
    
    if (ram.type !== motherboard.ram_type) {
      issues.push(`A memória ${ram.name} não é compatível com a placa-mãe ${motherboard.name}. Tipos diferentes: ${ram.type} vs ${motherboard.ram_type}`);
    }
  }
  
  return {
    compatible: issues.length === 0,
    issues
  };
}

// Função para calcular desempenho estimado
export function calculatePerformance(selectedComponents) {
  // Pesos para cada componente no cálculo de desempenho
  const weights = {
    cpu: 0.3,
    gpu: 0.4,
    ram: 0.15,
    storage: 0.1,
    motherboard: 0.05
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  // Calcula a pontuação ponderada
  for (const type in selectedComponents) {
    if (weights[type]) {
      totalScore += (selectedComponents[type].performance_score || 0) * weights[type];
      totalWeight += weights[type];
    }
  }
  
  // Se não houver componentes com peso, retorna 0
  if (totalWeight === 0) return 0;
  
  // Normaliza para uma escala de 0-100
  return Math.round((totalScore / totalWeight) * 100) / 100;
}

// Função para salvar uma configuração de PC
export async function saveConfiguration(userId, components, name) {
  try {
    const { data, error } = await supabase
      .from('pc_configurations')
      .insert([
        {
          user_id: userId,
          name: name || `Configuração ${new Date().toLocaleDateString()}`,
          components,
          performance_score: calculatePerformance(components),
          total_price: calculateTotalPrice(components)
        }
      ])
      .select();
      
    if (error) throw error;
    
    return { success: true, configuration: data[0] };
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return { success: false, error: error.message };
  }
}

// Função para buscar configurações salvas de um usuário
export async function getUserConfigurations(userId) {
  try {
    const { data, error } = await supabase
      .from('pc_configurations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { success: true, configurations: data };
  } catch (error) {
    console.error('Erro ao buscar configurações do usuário:', error);
    return { success: false, error: error.message };
  }
}

// Função para calcular o preço total
export function calculateTotalPrice(components) {
  let total = 0;
  
  for (const type in components) {
    total += components[type].price || 0;
  }
  
  return total;
}

// Função para adicionar configuração ao carrinho
export async function addConfigurationToCart(userId, configId) {
  try {
    // Primeiro, busca a configuração
    const { data: configData, error: configError } = await supabase
      .from('pc_configurations')
      .select('*')
      .eq('id', configId)
      .single();
      
    if (configError) throw configError;
    
    // Adiciona ao carrinho
    const { error: cartError } = await supabase
      .from('cart_items')
      .insert([
        {
          user_id: userId,
          product_type: 'pc_configuration',
          product_id: configId,
          quantity: 1,
          price: configData.total_price,
          name: configData.name,
          details: configData.components
        }
      ]);
      
    if (cartError) throw cartError;
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar configuração ao carrinho:', error);
    return { success: false, error: error.message };
  }
}
