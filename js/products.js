// products.js - Funções para gerenciamento de produtos
import { supabase } from './supabase.js';

// Função para buscar todos os produtos
export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('name');
      
    if (error) throw error;
    
    return { success: true, products: data };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return { success: false, error: error.message };
  }
}

// Função para buscar produtos por categoria
export async function getProductsByCategory(categoryId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('category_id', categoryId)
      .order('name');
      
    if (error) throw error;
    
    return { success: true, products: data };
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    return { success: false, error: error.message };
  }
}

// Função para buscar um produto específico
export async function getProductById(productId) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', productId)
      .single();
      
    if (error) throw error;
    
    return { success: true, product: data };
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return { success: false, error: error.message };
  }
}

// Função para adicionar um novo produto
export async function addProduct(productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();
      
    if (error) throw error;
    
    return { success: true, product: data[0] };
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, error: error.message };
  }
}

// Função para atualizar um produto existente
export async function updateProduct(productId, productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select();
      
    if (error) throw error;
    
    return { success: true, product: data[0] };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, error: error.message };
  }
}

// Função para excluir um produto
export async function deleteProduct(productId) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return { success: false, error: error.message };
  }
}

// Função para buscar todas as categorias
export async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return { success: true, categories: data };
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return { success: false, error: error.message };
  }
}

// Função para adicionar uma nova categoria
export async function addCategory(categoryData) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select();
      
    if (error) throw error;
    
    return { success: true, category: data[0] };
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    return { success: false, error: error.message };
  }
}

// Função para atualizar o estoque de um produto
export async function updateProductStock(productId, quantity) {
  try {
    // Primeiro, obtém o estoque atual
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Calcula o novo estoque
    const newStock = currentProduct.stock + quantity;
    
    // Atualiza o estoque
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    return { success: true, newStock };
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    return { success: false, error: error.message };
  }
}

// Função para fazer upload de imagem de produto
export async function uploadProductImage(file, productId) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Obtém a URL pública da imagem
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);
      
    // Atualiza o produto com a URL da imagem
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: data.publicUrl })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    return { success: true, imageUrl: data.publicUrl };
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    return { success: false, error: error.message };
  }
}
