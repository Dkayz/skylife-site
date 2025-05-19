# Guia de Implementação: Skylife Tecnologias com Vercel + Supabase

Este guia detalhado vai ajudar você a publicar seu site da Skylife Tecnologias usando Vercel para hospedagem e Supabase como banco de dados, permitindo que você tenha um site dinâmico com painel administrativo funcional, tudo gratuitamente.

## Parte 1: Criar Contas e Configurar Projetos

### 1.1. Criar conta no Vercel

1. Acesse https://vercel.com/signup
2. Clique em "Continue with GitHub" (recomendado para facilitar a integração)
3. Se você não tiver uma conta GitHub, será solicitado a criar uma
4. Siga as instruções para autorizar o Vercel a acessar sua conta GitHub
5. Complete o cadastro gratuito no Vercel

### 1.2. Criar conta no Supabase

1. Acesse https://supabase.com/dashboard/sign-up
2. Você pode usar sua conta GitHub para se cadastrar ou criar uma conta com e-mail
3. Complete o cadastro gratuito
4. Após fazer login, você será direcionado para o dashboard do Supabase

### 1.3. Criar um novo projeto no Supabase

1. No dashboard do Supabase, clique no botão "New Project"
2. Preencha as informações do projeto:
   - Nome: "skylife" (ou outro nome de sua preferência)
   - Senha do banco de dados: crie uma senha forte e anote-a
   - Região: escolha a mais próxima do Brasil (geralmente "South America (São Paulo)")
3. Clique em "Create new project"
4. Aguarde a criação do projeto (pode levar alguns minutos)

### 1.4. Configurar o banco de dados no Supabase

1. No painel do seu projeto Supabase, vá para "Table Editor" no menu lateral
2. Vamos criar as tabelas necessárias:

#### Tabela de Produtos
1. Clique em "New Table"
2. Nome da tabela: "products"
3. Adicione as seguintes colunas:
   - id: já vem por padrão (tipo UUID, primary key)
   - name: tipo text, NOT NULL
   - description: tipo text
   - price: tipo numeric, NOT NULL
   - original_price: tipo numeric
   - image_url: tipo text
   - category_id: tipo UUID, referência para categories.id
   - stock: tipo integer, default 0
   - featured: tipo boolean, default false
4. Clique em "Save" para criar a tabela

#### Tabela de Categorias
1. Clique em "New Table"
2. Nome da tabela: "categories"
3. Adicione as seguintes colunas:
   - id: já vem por padrão (tipo UUID, primary key)
   - name: tipo text, NOT NULL
   - description: tipo text
4. Clique em "Save" para criar a tabela

#### Tabela de Staff
1. Clique em "New Table"
2. Nome da tabela: "staff"
3. Adicione as seguintes colunas:
   - id: já vem por padrão (tipo UUID, primary key)
   - user_id: tipo UUID, NOT NULL
   - name: tipo text, NOT NULL
   - email: tipo text, NOT NULL
   - role: tipo text, NOT NULL
   - permissions: tipo text[], default '{}'
4. Clique em "Save" para criar a tabela

#### Tabela de Componentes de PC
1. Clique em "New Table"
2. Nome da tabela: "pc_components"
3. Adicione as seguintes colunas:
   - id: já vem por padrão (tipo UUID, primary key)
   - name: tipo text, NOT NULL
   - type: tipo text, NOT NULL
   - price: tipo numeric, NOT NULL
   - performance_score: tipo integer
   - image_url: tipo text
   - socket: tipo text (para CPUs e placas-mãe)
   - ram_type: tipo text (para placas-mãe)
   - wattage: tipo integer (para fontes)
   - power_consumption: tipo integer
4. Clique em "Save" para criar a tabela

### 1.5. Configurar autenticação no Supabase

1. No menu lateral, vá para "Authentication" > "Providers"
2. Verifique se o Email Auth está habilitado
3. Em "Site URL", coloque temporariamente "http://localhost:3000" (vamos atualizar depois)
4. Clique em "Save"

### 1.6. Obter as credenciais do Supabase

1. No menu lateral, vá para "Project Settings" > "API"
2. Você verá duas chaves importantes:
   - URL: anote o "Project URL"
   - anon/public: anote a "anon key"
3. Essas informações serão usadas para conectar o site ao Supabase

## Parte 2: Preparar o Repositório no GitHub

### 2.1. Criar um novo repositório no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: "skylife-site"
3. Descrição: "Site da Skylife Tecnologias"
4. Deixe o repositório como "Public"
5. Clique em "Create repository"

### 2.2. Fazer upload dos arquivos para o GitHub

Existem duas maneiras de fazer isso:

#### Opção 1: Upload direto pelo GitHub (mais fácil)
1. No seu repositório, clique no botão "Add file" > "Upload files"
2. Arraste todos os arquivos do site para a área de upload
3. Adicione uma mensagem de commit como "Versão inicial do site"
4. Clique em "Commit changes"

#### Opção 2: Usando Git (mais técnico)
1. Instale o Git em seu computador se ainda não tiver
2. Abra o terminal/prompt de comando
3. Navegue até a pasta do site
4. Execute os seguintes comandos:
   ```
   git init
   git add .
   git commit -m "Versão inicial do site"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/skylife-site.git
   git push -u origin main
   ```

## Parte 3: Publicar o Site no Vercel

### 3.1. Importar o repositório no Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New" > "Project"
3. Na lista de repositórios, encontre e selecione "skylife-site"
4. Clique em "Import"

### 3.2. Configurar o projeto no Vercel

1. Na tela de configuração do projeto:
   - Framework Preset: deixe como "Other"
   - Root Directory: deixe como "/"
   - Build Command: deixe em branco
   - Output Directory: deixe em branco
2. Expanda a seção "Environment Variables"
3. Adicione as seguintes variáveis de ambiente:
   - Nome: SUPABASE_URL, Valor: [URL do projeto Supabase que você anotou]
   - Nome: SUPABASE_KEY, Valor: [anon key do Supabase que você anotou]
4. Clique em "Deploy"

### 3.3. Aguardar a implantação

1. O Vercel vai iniciar o processo de implantação do seu site
2. Aguarde até que o processo seja concluído (geralmente leva menos de 1 minuto)
3. Quando terminar, você verá uma mensagem de sucesso e um link para o seu site

### 3.4. Atualizar a URL do site no Supabase

1. Copie a URL do seu site no Vercel (algo como https://skylife-site.vercel.app)
2. Volte ao dashboard do Supabase
3. Vá para "Authentication" > "URL Configuration"
4. Atualize o "Site URL" com a URL do seu site no Vercel
5. Clique em "Save"

## Parte 4: Configurar o Primeiro Usuário Administrador

### 4.1. Acessar o site e criar o primeiro usuário

1. Acesse seu site publicado (URL fornecida pelo Vercel)
2. Vá para a página de registro: clique em "Login" no canto superior direito e depois em "Cadastre-se"
3. Preencha o formulário de registro com suas informações:
   - Nome: Seu nome
   - E-mail: Seu e-mail
   - Senha: Crie uma senha forte
4. Clique em "Cadastrar"

### 4.2. Transformar seu usuário em administrador

Como este é o primeiro usuário, precisamos transformá-lo em administrador manualmente:

1. Volte ao dashboard do Supabase
2. Vá para "Table Editor" > "staff"
3. Encontre seu usuário na lista
4. Clique nele para editar
5. Altere o campo "role" para "admin"
6. Altere o campo "permissions" para ["all"]
7. Clique em "Save"

### 4.3. Testar o acesso de administrador

1. Volte ao seu site
2. Faça login com suas credenciais
3. Você deve ser redirecionado para o painel administrativo
4. Verifique se você tem acesso a todas as funcionalidades

## Parte 5: Adicionar Produtos e Categorias

### 5.1. Adicionar categorias

1. No painel administrativo, vá para "Categorias"
2. Clique em "Adicionar Categoria"
3. Preencha as informações da categoria:
   - Nome: ex. "Hardware"
   - Descrição: ex. "Componentes para computadores"
4. Clique em "Salvar"
5. Repita o processo para adicionar mais categorias

### 5.2. Adicionar produtos

1. No painel administrativo, vá para "Produtos"
2. Clique em "Adicionar Produto"
3. Preencha as informações do produto:
   - Nome: nome do produto
   - Descrição: descrição detalhada
   - Preço: valor atual
   - Preço Original: valor antes do desconto (opcional)
   - Categoria: selecione uma categoria
   - Estoque: quantidade disponível
   - Destaque: marque se quiser que apareça na seção de destaques
4. Faça upload de uma imagem para o produto
5. Clique em "Salvar"
6. Repita o processo para adicionar mais produtos

### 5.3. Adicionar componentes para o montador de PC

1. No painel administrativo, vá para "Componentes de PC"
2. Clique em "Adicionar Componente"
3. Preencha as informações do componente:
   - Nome: nome do componente
   - Tipo: selecione o tipo (CPU, GPU, etc.)
   - Preço: valor do componente
   - Pontuação de Desempenho: valor de 0 a 100
   - Informações específicas para cada tipo de componente
4. Clique em "Salvar"
5. Repita o processo para adicionar mais componentes

## Parte 6: Personalizar o Site

### 6.1. Atualizar informações de contato

1. No painel administrativo, vá para "Configurações"
2. Atualize as informações de contato:
   - Telefone
   - E-mail
   - Endereço
   - Redes sociais
3. Clique em "Salvar"

### 6.2. Personalizar banners e promoções

1. No painel administrativo, vá para "Banners"
2. Adicione ou edite banners para a página inicial
3. Configure promoções especiais

## Parte 7: Manutenção e Atualizações

### 7.1. Atualizar o site

Sempre que você fizer alterações no código do site:

1. Faça upload das alterações para o GitHub
2. O Vercel detectará automaticamente as alterações e fará uma nova implantação
3. Não é necessário fazer nada manualmente

### 7.2. Monitorar o uso do plano gratuito

Os planos gratuitos do Vercel e Supabase têm limites:

- Vercel: 100GB de largura de banda por mês
- Supabase: 500MB de armazenamento de banco de dados, 2GB de transferência por mês

Monitore o uso para garantir que você não ultrapasse esses limites.

## Solução de Problemas Comuns

### Problema: Não consigo fazer login
- Verifique se o e-mail e senha estão corretos
- Verifique se a URL do site está configurada corretamente no Supabase
- Tente redefinir sua senha

### Problema: Imagens não aparecem
- Verifique se os caminhos das imagens estão corretos
- Verifique se as imagens foram carregadas corretamente para o GitHub

### Problema: Erros no console
- Abra o console do navegador (F12) para ver mensagens de erro detalhadas
- Verifique se as variáveis de ambiente estão configuradas corretamente no Vercel

### Problema: Banco de dados não atualiza
- Verifique se as credenciais do Supabase estão corretas
- Verifique se as tabelas foram criadas corretamente

## Recursos Adicionais

- Documentação do Vercel: https://vercel.com/docs
- Documentação do Supabase: https://supabase.com/docs
- Tutoriais em vídeo: [links para tutoriais relevantes]

## Próximos Passos

Quando sua situação financeira melhorar, você pode considerar:

1. Migrar para um plano pago do Supabase para mais recursos
2. Adicionar um domínio personalizado ao seu site
3. Implementar um sistema de pagamento como Stripe ou PayPal
4. Expandir as funcionalidades do site com mais recursos

Lembre-se de que estou à disposição para ajudar com qualquer dúvida ou problema que você encontrar durante o processo de implementação!
