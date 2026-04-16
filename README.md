# 🗓️ Mini Sistema de Agendamento

Sistema simples de agendamento de serviços com regras de negócio, desenvolvido com:

- Backend: Laravel (API REST)
- Frontend: React + Vite + Bootstrap
- Banco: MySQL (via Docker)

---

# 🚀 Funcionalidades

- Listar serviços
- Inserir Serviços (admin default_password: 123456)
- Criar agendamentos
- Listar agendamentos
- Excluir agendamentos
- Validações:
  - Horário comercial (08:00 às 18:00)
  - Conflito de horários
  - Campos obrigatórios

---

# 🧱 Estrutura do Projeto

---

## ⚙️ docker (Configuração do banco (MySQL))

### 📌 Requisitos

- `docker-compose.yml`

## ⚙️ Backend (Laravel)
### 📌 Requisitos
- PHP 8+
- Composer

### Instalação
```bash
git clone https://github.com/Djalma-Neto/AgendamentoServicos.git
cd AgendamentoServicos
docker-compose up -d
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
## ⚙️ frontend (React App)
### 📌 Requisitos
- Node.js 22+
- npm 10+

### Instalação
```bash
git clone https://github.com/Djalma-Neto/ReactProject.git
cd ReactProject
npm install
npm run dev
```
