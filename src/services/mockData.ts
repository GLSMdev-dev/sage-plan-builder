import { User } from '@/services/authService';
import { PlanoAula } from '@/services/planoService';

// Usuários mockados
export const MOCK_USERS: (User & { senha: string })[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    email: 'professor@sage.com',
    perfil: 'professor',
    senha: '123456',
  },
  {
    id: '2',
    nome: 'Carlos Oliveira',
    email: 'professor2@sage.com',
    perfil: 'professor',
    senha: '123456',
  },
  {
    id: '3',
    nome: 'Ana Costa',
    email: 'gestor@sage.com',
    perfil: 'gestor',
    senha: '123456',
  },
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
