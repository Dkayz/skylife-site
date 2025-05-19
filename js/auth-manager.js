// auth-manager.js - Gerenciamento de autenticação global para o site
import { supabase } from './supabase.js';
import { getCurrentUser } from './auth.js';

// Classe para gerenciar autenticação em todo o site
export class AuthManager {
  constructor() {
    this.user = null;
    this.staff = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
  }

  // Inicializa o gerenciador de autenticação
  async init() {
    try {
      // Verifica se o usuário está autenticado
      const result = await getCurrentUser();
      
      if (result.success) {
        this.user = result.user;
        this.staff = result.staff;
        this.isAuthenticated = true;
        this.isAdmin = result.staff?.role === 'admin';
        
        // Atualiza a interface com base no estado de autenticação
        this.updateUI();
        
        console.log('Usuário autenticado:', this.user.email);
        return true;
      } else {
        this.resetState();
        return false;
      }
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      this.resetState();
      return false;
    }
  }
  
  // Reseta o estado de autenticação
  resetState() {
    this.user = null;
    this.staff = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.updateUI();
  }
  
  // Atualiza a interface com base no estado de autenticação
  updateUI() {
    const userActionsDiv = document.querySelector('.user-actions');
    if (!userActionsDiv) return;
    
    if (this.isAuthenticated) {
      // Usuário autenticado - mostra links personalizados
      userActionsDiv.innerHTML = `
        <a href="${this.getRelativePath()}admin/dashboard.html"><i class="fas fa-tachometer-alt"></i> Painel</a>
        <a href="${this.getRelativePath()}admin/profile.html"><i class="fas fa-user"></i> ${this.user.email}</a>
        <a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> Sair</a>
      `;
      
      // Adiciona evento de logout
      const logoutLink = document.getElementById('logout-link');
      if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
          e.preventDefault();
          await this.logout();
        });
      }
    } else {
      // Usuário não autenticado - mostra links padrão
      userActionsDiv.innerHTML = `
        <a href="${this.getRelativePath()}admin/login.html"><i class="fas fa-user"></i> Minha Conta</a>
        <a href="${this.getRelativePath()}admin/login.html"><i class="fas fa-sign-in-alt"></i> Login</a>
        <a href="${this.getRelativePath()}admin/register.html"><i class="fas fa-user-plus"></i> Cadastre-se</a>
      `;
    }
  }
  
  // Determina o caminho relativo com base na URL atual
  getRelativePath() {
    // Verifica se estamos em uma subpasta
    if (window.location.pathname.includes('/categories/') || 
        window.location.pathname.includes('/admin/')) {
      return '../';
    }
    return '';
  }
  
  // Realiza logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.resetState();
      
      // Redireciona para a página inicial
      window.location.href = this.getRelativePath() + 'index.html';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao fazer logout. Por favor, tente novamente.');
    }
  }
}

// Cria e exporta uma instância global do gerenciador de autenticação
export const authManager = new AuthManager();

// Inicializa o gerenciador de autenticação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  await authManager.init();
});
