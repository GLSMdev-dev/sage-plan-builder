import { User, LoginCredentials, AuthResponse } from '@/services/authService';
import { PlanoAula } from '@/services/planoService';
import { MOCK_USERS, MOCK_PLANOS, MOCK_DISCIPLINAS, Disciplina } from '@/services/mockData';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Estado local
let planosDb = [...MOCK_PLANOS];
let disciplinasDb = [...MOCK_DISCIPLINAS];
// Usuários mutáveis
let usersDb = [...MOCK_USERS];

export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(600);
    const user = usersDb.find(
      u => u.email === credentials.email && u.senha === credentials.senha
    );
    if (!user) {
      throw new Error('Credenciais inválidas');
    }
    if (user.status === 'inativo') {
      throw new Error('Conta desativada. Contate a gestão.');
    }
    const { senha: _, ...userData } = user;
    return {
      token: `mock-token-${user.id}-${Date.now()}`,
      usuario: userData as User,
    };
  },

  register: async (data: { nome: string; email: string; senha: string; cpf?: string }): Promise<AuthResponse> => {
    await delay(600);
    const exists = usersDb.find(u => u.email === data.email);
    if (exists) {
      throw new Error('Email já cadastrado');
    }
    const newUser: User = {
      id: String(Date.now()),
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
      perfil: 'professor',
      status: 'ativo',
      dataCadastro: new Date().toISOString(),
      disciplinasLecionadas: [],
    };
    usersDb.push({ ...newUser, senha: data.senha });
    return {
      token: `mock-token-${newUser.id}-${Date.now()}`,
      usuario: newUser,
    };
  },
};

export const mockGestorService = {
  // === Professores ===
  listarProfessores: async (): Promise<User[]> => {
    await delay(300);
    return usersDb.filter(u => u.perfil === 'professor').map(({ senha, ...u }) => u as User);
  },
  salvarProfessor: async (prof: Partial<User & { senha?: string }>): Promise<User> => {
    await delay(400);
    // Validação de unicidade
    const emailExist = usersDb.find(u => u.email === prof.email && u.id !== prof.id);
    if (emailExist) throw new Error('E-mail já está em uso por outro usuário.');
    
    if (prof.cpf) {
      const cpfExist = usersDb.find(u => u.cpf === prof.cpf && u.id !== prof.id);
      if (cpfExist) throw new Error('CPF já cadastrado.');
    }

    if (prof.id) {
      const idx = usersDb.findIndex(u => u.id === prof.id);
      if (idx > -1) {
        usersDb[idx] = { ...usersDb[idx], ...prof } as any;
        const { senha, ...user } = usersDb[idx];
        return user as User;
      }
    }
    const novo = {
      ...prof,
      id: String(Date.now()),
      perfil: 'professor',
      status: prof.status || 'ativo',
      dataCadastro: new Date().toISOString(),
      disciplinasLecionadas: prof.disciplinasLecionadas || [],
      senha: prof.senha || '123456',
    } as any;
    usersDb.push(novo);
    const { senha, ...user } = novo;
    return user as User;
  },
  excluirProfessor: async (id: string): Promise<void> => {
    await delay(300);
    const hasActivePlans = planosDb.some(p => p.professorId === id && p.status === 'rascunho');
    if (hasActivePlans) {
      throw new Error('Não é possível inativar. O professor possui planos de aula em andamento.');
    }
    const idx = usersDb.findIndex(u => u.id === id);
    if (idx > -1) {
      usersDb[idx].status = usersDb[idx].status === 'inativo' ? 'ativo' : 'inativo';
    }
  },

  // === Disciplinas ===
  listarDisciplinas: async (): Promise<Disciplina[]> => {
    await delay(300);
    return [...disciplinasDb];
  },
  salvarDisciplina: async (disc: Partial<Disciplina>): Promise<Disciplina> => {
    await delay(400);
    if (disc.codigo) {
      const codigoExist = disciplinasDb.find(d => d.codigo === disc.codigo && d.id !== disc.id);
      if (codigoExist) throw new Error('Código já cadastrado em outra disciplina.');
    }

    if (disc.id) {
      const idx = disciplinasDb.findIndex(d => d.id === disc.id);
      if (idx > -1) {
        disciplinasDb[idx] = { ...disciplinasDb[idx], ...disc } as Disciplina;
        return disciplinasDb[idx];
      }
    }
    const nova: Disciplina = {
      id: String(Date.now()),
      nome: disc.nome || '',
      codigo: disc.codigo || '',
      cor: disc.cor || '#3b82f6',
      serie: disc.serie || '1ª Série',
      cargaHoraria: disc.cargaHoraria || 0,
      status: disc.status || 'ativa',
    };
    disciplinasDb.push(nova);
    return nova;
  },
  excluirDisciplina: async (id: string): Promise<void> => {
    await delay(300);
    const hasPlans = planosDb.some(p => p.disciplina === disciplinasDb.find(d => d.id === id)?.nome);
    const hasProfs = usersDb.some(u => u.disciplinasLecionadas?.includes(id));
    
    if (hasPlans || hasProfs) {
      // Exclusão lógica
      const idx = disciplinasDb.findIndex(d => d.id === id);
      if (idx > -1) disciplinasDb[idx].status = 'inativa';
      throw new Error('Disciplina inativada (já possui vínculos de planos ou professores).');
    } else {
      // Exclusão física
      disciplinasDb = disciplinasDb.filter(d => d.id !== id);
    }
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
