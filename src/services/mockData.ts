import { User } from '@/services/authService';
import { PlanoAula } from '@/services/planoService';

// Usuários mockados
export const MOCK_USERS: (User & { senha: string })[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    email: 'professor@sage.com',
    cpf: '111.111.111-11',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2025-01-10T08:00:00Z',
    disciplinasLecionadas: ['1', '4'], // Matemática, História
    senha: '123456',
  },
  {
    id: '2',
    nome: 'Carlos Oliveira',
    email: 'professor2@sage.com',
    cpf: '222.222.222-22',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2025-02-15T09:30:00Z',
    disciplinasLecionadas: ['3'], // Ciências
    senha: '123456',
  },
  {
    id: '3',
    nome: 'Ana Costa',
    email: 'gestor@sage.com',
    perfil: 'gestor',
    status: 'ativo',
    dataCadastro: '2025-01-01T07:00:00Z',
    senha: '123456',
  },
];

export interface Disciplina {
  id: string;
  nome: string;
  codigo?: string;
  cor?: string;
  serie: string;
  cargaHoraria: number;
  status: 'ativa' | 'inativa';
}

export const MOCK_DISCIPLINAS: Disciplina[] = [
  { id: '1', nome: 'Matemática', codigo: 'MAT01', cor: '#3b82f6', serie: '1ª Série', cargaHoraria: 5, status: 'ativa' },
  { id: '1b', nome: 'Matemática', codigo: 'MAT02', cor: '#3b82f6', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: '2', nome: 'Português', codigo: 'POR01', cor: '#ef4444', serie: '1ª Série', cargaHoraria: 5, status: 'ativa' },
  { id: '3', nome: 'Ciências', codigo: 'CIE03', cor: '#22c55e', serie: '3ª Série', cargaHoraria: 3, status: 'ativa' },
  { id: '4', nome: 'História', codigo: 'HIS01', cor: '#eab308', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: '4b', nome: 'História', codigo: 'HIS02', cor: '#eab308', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: '5', nome: 'Geografia', codigo: 'GEO02', cor: '#f97316', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
];

// Planos mockados
export const MOCK_PLANOS: PlanoAula[] = [
  {
    _id: 'p1',
    professorId: '1',
    professorNome: 'Maria Silva',
    disciplina: 'Matemática',
    turma: '1ª Série',
    mesAno: '2026-03',
    objetivos: 'Desenvolver o raciocínio lógico-matemático através de operações básicas e resolução de problemas contextualizados.',
    conteudo: 'Números naturais, adição e subtração, problemas do cotidiano.',
    avaliacao: 'Avaliação contínua através de exercícios em sala e participação.',
    semanas: [
      { numero: 1, metodologia: 'Aula expositiva com material concreto (blocos lógicos). Atividade em duplas para contagem.', recursos: 'Blocos lógicos, quadro branco, fichas numeradas.' },
      { numero: 2, metodologia: 'Jogos matemáticos em grupo. Resolução de problemas no caderno.', recursos: 'Jogos de tabuleiro, caderno, lápis coloridos.' },
      { numero: 3, metodologia: 'Atividade prática: mercadinho simulado para trabalhar adição e subtração.', recursos: 'Cédulas e moedas de brinquedo, etiquetas de preço.' },
      { numero: 4, metodologia: 'Revisão com quiz interativo e avaliação individual escrita.', recursos: 'Projetor, folhas de avaliação impressas.' },
    ],
    status: 'finalizado',
    criadoEm: '2026-02-28T10:00:00Z',
    atualizadoEm: '2026-03-05T14:30:00Z',
  },
  {
    _id: 'p2',
    professorId: '1',
    professorNome: 'Maria Silva',
    disciplina: 'Português',
    turma: '2ª Série',
    mesAno: '2026-03',
    objetivos: 'Aprimorar a leitura e interpretação de textos curtos, ampliando o vocabulário.',
    conteudo: 'Leitura de contos e fábulas, interpretação textual, ortografia.',
    avaliacao: 'Produção textual e leitura em voz alta.',
    semanas: [
      { numero: 1, metodologia: 'Roda de leitura com conto "A Cigarra e a Formiga". Discussão oral.', recursos: 'Livro de fábulas, almofadas para roda de leitura.' },
      { numero: 2, metodologia: 'Atividade de reescrita do conto com desenho. Trabalho individual.', recursos: 'Folhas pautadas, lápis de cor, borracha.' },
      { numero: 3, metodologia: 'Ditado de palavras do conto. Atividade em duplas de ortografia.', recursos: 'Caderno, dicionário ilustrado.' },
    ],
    status: 'rascunho',
    criadoEm: '2026-03-01T08:00:00Z',
    atualizadoEm: '2026-03-01T08:00:00Z',
  },
  {
    _id: 'p3',
    professorId: '2',
    professorNome: 'Carlos Oliveira',
    disciplina: 'Ciências',
    turma: '3ª Série',
    mesAno: '2026-03',
    objetivos: 'Compreender o ciclo da água e sua importância para o meio ambiente.',
    conteudo: 'Ciclo da água, estados físicos, preservação ambiental.',
    avaliacao: 'Maquete do ciclo da água e apresentação oral.',
    semanas: [
      { numero: 1, metodologia: 'Vídeo sobre ciclo da água seguido de debate em sala.', recursos: 'Projetor, vídeo educativo, caderno.' },
      { numero: 2, metodologia: 'Experimento: evaporação e condensação com materiais simples.', recursos: 'Copos, água, plástico filme, gelo.' },
      { numero: 3, metodologia: 'Construção de maquete do ciclo da água em grupos.', recursos: 'Isopor, tinta guache, algodão, cola.' },
      { numero: 4, metodologia: 'Apresentação das maquetes e avaliação oral.', recursos: 'Maquetes prontas, rubrica de avaliação.' },
    ],
    status: 'finalizado',
    criadoEm: '2026-02-25T09:00:00Z',
    atualizadoEm: '2026-03-04T11:00:00Z',
  },
  {
    _id: 'p4',
    professorId: '1',
    professorNome: 'Maria Silva',
    disciplina: 'História',
    turma: '1ª Série',
    mesAno: '2026-02',
    objetivos: 'Reconhecer a importância da família e da comunidade na formação da identidade.',
    conteudo: 'Família, comunidade, identidade cultural.',
    avaliacao: 'Desenho da árvore genealógica e relato oral.',
    semanas: [
      { numero: 1, metodologia: 'Conversa sobre família. Cada aluno apresenta foto da família.', recursos: 'Fotos trazidas de casa, mural da sala.' },
      { numero: 2, metodologia: 'Construção da árvore genealógica com recortes e colagem.', recursos: 'Cartolina, cola, tesoura, revistas.' },
    ],
    status: 'finalizado',
    criadoEm: '2026-01-28T10:00:00Z',
    atualizadoEm: '2026-02-10T16:00:00Z',
  },
];
