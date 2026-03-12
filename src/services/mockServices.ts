import { User, LoginCredentials, AuthResponse } from '@/services/authService';
import { PlanoAula } from '@/services/planoService';
import { MOCK_USERS, MOCK_PLANOS } from '@/services/mockData';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Estado local dos planos (simula banco)
let planosDb = [...MOCK_PLANOS];

export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(600);
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.senha === credentials.senha
    );
    if (!user) {
      throw new Error('Credenciais inválidas');
    }
    const { senha: _, ...userData } = user;
    return {
      token: `mock-token-${user.id}-${Date.now()}`,
      usuario: userData as User,
    };
  },

  register: async (data: { nome: string; email: string; senha: string }): Promise<AuthResponse> => {
    await delay(600);
    const exists = MOCK_USERS.find(u => u.email === data.email);
    if (exists) {
      throw new Error('Email já cadastrado');
    }
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      nome: data.nome,
      email: data.email,
      perfil: 'professor',
    };
    MOCK_USERS.push({ ...newUser, senha: data.senha });
    return {
      token: `mock-token-${newUser.id}-${Date.now()}`,
      usuario: newUser,
    };
  },
};

export const mockPlanoService = {
  listar: async (professorId?: string): Promise<PlanoAula[]> => {
    await delay(400);
    if (professorId) {
      return planosDb.filter(p => p.professorId === professorId);
    }
    return [...planosDb];
  },

  buscarPorId: async (id: string): Promise<PlanoAula> => {
    await delay(300);
    const plano = planosDb.find(p => p._id === id);
    if (!plano) throw new Error('Plano não encontrado');
    return { ...plano };
  },

  criar: async (plano: Omit<PlanoAula, '_id' | 'criadoEm' | 'atualizadoEm'>): Promise<PlanoAula> => {
    await delay(500);
    const novo: PlanoAula = {
      ...plano,
      _id: `p${Date.now()}`,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    planosDb.push(novo);
    return novo;
  },

  atualizar: async (id: string, dados: Partial<PlanoAula>): Promise<PlanoAula> => {
    await delay(500);
    const index = planosDb.findIndex(p => p._id === id);
    if (index === -1) throw new Error('Plano não encontrado');
    planosDb[index] = {
      ...planosDb[index],
      ...dados,
      atualizadoEm: new Date().toISOString(),
    };
    return { ...planosDb[index] };
  },

  excluir: async (id: string): Promise<void> => {
    await delay(400);
    const index = planosDb.findIndex(p => p._id === id);
    if (index === -1) throw new Error('Plano não encontrado');
    planosDb.splice(index, 1);
  },

  duplicar: async (id: string, professorId: string, professorNome: string): Promise<PlanoAula> => {
    await delay(500);
    const original = planosDb.find(p => p._id === id);
    if (!original) throw new Error('Plano não encontrado');
    const copia: PlanoAula = {
      ...original,
      _id: `p${Date.now()}`,
      professorId,
      professorNome,
      status: 'rascunho',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    planosDb.push(copia);
    return copia;
  },
};
