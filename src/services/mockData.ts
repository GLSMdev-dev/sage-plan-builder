import { User } from '@/services/authService';
import { PlanoAula } from '@/services/planoService';

export interface Disciplina {
  id: string;
  nome: string;
  codigo?: string;
  cor?: string;
  serie: string;
  cargaHoraria: number;
  status: 'ativa' | 'inativa';
}

// Usuários mockados
export const MOCK_USERS: (User & { senha?: string })[] = [
  {
    id: 'gestor_1',
    nome: 'DANIEL DE ARAUJO NUNES',
    email: 'daniel.nunes@prof.ce.gov.br',
    cpf: '045.795.333-05',
    perfil: 'gestor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    senha: '045795'
  },
  {
    id: 'gestor_2',
    nome: 'GUILHERME LUIS DOS SANTOS MOREIRA',
    email: 'guilherme.moreira@prof.ce.gov.br',
    cpf: '107.116.344-24',
    perfil: 'gestor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    senha: '107116'
  },
  {
    id: 'gestor_3',
    nome: 'ROGERIO GOMES DA SILVA',
    email: 'rogerio.rgsilva@prof.ce.gov.br',
    cpf: '022.813.973-27',
    perfil: 'gestor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    senha: '022813'
  },
  {
    id: 'p_100',
    nome: 'AMANDA DE SENA GUSMAO',
    email: 'amanda.gusmao@prof.ce.gov.br',
    cpf: '075.733.284-60',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_1',
      'd_2',
      'd_3',
      'd_4'
    ],
    senha: '075733'
  },
  {
    id: 'p_101',
    nome: 'ANA CRISTINA DE SOUZA LIMA',
    email: 'ana.lima41@prof.ce.gov.br',
    cpf: '008.548.263-35',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_5',
      'd_6',
      'd_7',
      'd_8'
    ],
    senha: '008548'
  },
  {
    id: 'p_102',
    nome: 'ANDREIA FELIZARDO LIMA',
    email: 'andreia.lima11@prof.ce.gov.br',
    cpf: '055.747.663-10',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_9',
      'd_10',
      'd_11'
    ],
    senha: '055747'
  },
  {
    id: 'p_103',
    nome: 'BRENDA SILVA MARQUES VIEIRA',
    email: 'brenda.vieira@prof.ce.gov.br',
    cpf: '074.001.373-44',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_9',
      'd_12',
      'd_13',
      'd_14',
      'd_15'
    ],
    senha: '074001'
  },
  {
    id: 'p_104',
    nome: 'DIEGO CAVALCANTE DE OLIVEIRA',
    email: 'diego.oliveira2@prof.ce.gov.br',
    cpf: '034.839.493-48',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_16',
      'd_17'
    ],
    senha: '034839'
  },
  {
    id: 'p_105',
    nome: 'EMANOEL MIRANDA DE OLIVEIRA',
    email: 'emanoel.oliveira@prof.ce.gov.br',
    cpf: '813.459.683-53',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_18',
      'd_19'
    ],
    senha: '813459'
  },
  {
    id: 'p_106',
    nome: 'ERIK WILLER ALVES RODRIGUES',
    email: 'erik.rodrigues@prof.ce.gov.br',
    cpf: '053.401.543-35',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_20',
      'd_21',
      'd_22',
      'd_23',
      'd_7'
    ],
    senha: '053401'
  },
  {
    id: 'p_107',
    nome: 'FRANCISCA TEIXEIRA RODRIGUES',
    email: 'francisca.rodrigues10@prof.ce.gov.br',
    cpf: '022.229.113-38',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_24',
      'd_25',
      'd_26',
      'd_27',
      'd_28'
    ],
    senha: '022229'
  },
  {
    id: 'p_108',
    nome: 'FRANCISCO ALFREDO NICOLAU FILHO',
    email: 'francisco.filho3@prof.ce.gov.br',
    cpf: '369.432.663-49',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_29',
      'd_30',
      'd_31',
      'd_32',
      'd_33'
    ],
    senha: '369432'
  },
  {
    id: 'p_109',
    nome: 'HELIO GOMES E SILVA',
    email: 'helio.silva1@prof.ce.gov.br',
    cpf: '014.340.963-86',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_34',
      'd_25',
      'd_35',
      'd_36',
      'd_37',
      'd_38',
      'd_39'
    ],
    senha: '014340'
  },
  {
    id: 'p_110',
    nome: 'IASMIN CARMO RODRIGUES',
    email: 'iasmim.rodrigues@prof.ce.gov.br',
    cpf: '600.884.713-06',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_40'
    ],
    senha: '600884'
  },
  {
    id: 'p_111',
    nome: 'ITAERCIO PEREIRA DE LIMA',
    email: 'itaercio.lima@prof.ce.gov.br',
    cpf: '064.772.653-03',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_41',
      'd_42',
      'd_7',
      'd_38',
      'd_39',
      'd_2',
      'd_43'
    ],
    senha: '064772'
  },
  {
    id: 'p_112',
    nome: 'IVANEIDE ALVES DE ARAUJO',
    email: 'ivaneide.araujo@prof.ce.gov.br',
    cpf: '021.543.183-98',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_44',
      'd_45',
      'd_46',
      'd_47',
      'd_9'
    ],
    senha: '021543'
  },
  {
    id: 'p_113',
    nome: 'JOÃO IGOR GOMES DE SOUZA',
    email: 'joao.souza9@prof.ce.gov.br',
    cpf: '062.931.163-30',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_48',
      'd_49',
      'd_50',
      'd_23'
    ],
    senha: '062931'
  },
  {
    id: 'p_114',
    nome: 'TAMIRES SANTIAGO DOS SANTOS FERNANDES',
    email: 'tamires.fernandes@prof.ce.gov.br',
    cpf: '046.187.023-11',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_14',
      'd_15',
      'd_66',
      'd_13'
    ],
    senha: '046187'
  },
  {
    id: 'p_115',
    nome: 'LUCICLEIDE CARLOS TEIXEIRA',
    email: 'lucicleide.teixeira@prof.ce.gov.br',
    cpf: '515.062.204-44',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_51',
      'd_52',
      'd_53'
    ],
    senha: '515062'
  },
  {
    id: 'p_116',
    nome: 'LUIZ GOMES DE OLIVEIRA NETO',
    email: 'luiz.neto3@prof.ce.gov.br',
    cpf: '037.534.513-20',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_7',
      'd_29',
      'd_25',
      'd_54',
      'd_55',
      'd_42'
    ],
    senha: '037534'
  },
  {
    id: 'p_117',
    nome: 'MARCOS ANDRÉ QUEIROZ MACHADO',
    email: 'marcos.machado1@prof.ce.gov.br',
    cpf: '071.695.593-82',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_42',
      'd_38',
      'd_56',
      'd_39'
    ],
    senha: '071695'
  },
  {
    id: 'p_118',
    nome: 'MARCOS JOSE BENTO',
    email: 'marcos.bento@prof.ce.gov.br',
    cpf: '479.431.303-91',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_26',
      'd_57',
      'd_58',
      'd_27',
      'd_59',
      'd_60',
      'd_61',
      'd_62'
    ],
    senha: '479431'
  },
  {
    id: 'p_119',
    nome: 'MARIA JACKELINE PEREIRA DE LIMA',
    email: 'maria.lima200@prof.ce.gov.br',
    cpf: '077.910.523-00',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_63',
      'd_64',
      'd_23',
      'd_65'
    ],
    senha: '077910'
  },
  {
    id: 'p_120',
    nome: 'MIKAEL FERREIRA DE LIMA',
    email: 'mikael.lima@prof.ce.gov.br',
    cpf: '080.545.943-05',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_67',
      'd_68',
      'd_69'
    ],
    senha: '080545'
  },
  {
    id: 'p_121',
    nome: 'MORGANIA ALVES DE AMORIM',
    email: 'morgania.amorim@prof.ce.gov.br',
    cpf: '429.777.033-49',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_70',
      'd_71'
    ],
    senha: '429777'
  },
  {
    id: 'p_122',
    nome: 'NACIZO CANDIDO NETO',
    email: 'nacizo.neto@prof.ce.gov.br',
    cpf: '044.681.613-29',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_72',
      'd_45',
      'd_73',
      'd_47'
    ],
    senha: '044681'
  },
  {
    id: 'p_123',
    nome: 'NÁJILA RAQUEL MOREIRA DA SILVA',
    email: 'najila.silva@prof.ce.gov.br',
    cpf: '033.842.803-85',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_74',
      'd_46'
    ],
    senha: '033842'
  },
  {
    id: 'p_124',
    nome: 'PAULO VICTOR ARAUJO RICARTE',
    email: 'paulo.araujo5@prof.ce.gov.br',
    cpf: '032.354.363-40',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_34',
      'd_25',
      'd_75',
      'd_76',
      'd_77'
    ],
    senha: '032354'
  },
  {
    id: 'p_125',
    nome: 'REGILANIA OLIVEIRA DO NASCIMENTO',
    email: 'regilania.nascimento@prof.ce.gov.br',
    cpf: '062.935.073-63',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_25',
      'd_44',
      'd_45',
      'd_47',
      'd_78'
    ],
    senha: '062935'
  },
  {
    id: 'p_126',
    nome: 'RENATO SIQUEIRA',
    email: 'renato.siqueira@prof.ce.gov.br',
    cpf: '014.025.933-33',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_79',
      'd_80'
    ],
    senha: '014025'
  },
  {
    id: 'p_127',
    nome: 'SILAS MICAEL DO NASCIMENTO GOMES',
    email: 'silas.gomes@prof.ce.gov.br',
    cpf: '035.449.533-07',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_25',
      'd_51',
      'd_81',
      'd_82',
      'd_80',
      'd_83'
    ],
    senha: '035449'
  },
  {
    id: 'p_128',
    nome: 'THAIANA MAGNA MOURA SALDANHA',
    email: 'thaiana.saldanha@prof.ce.gov.br',
    cpf: '063.247.803-92',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_51',
      'd_83'
    ],
    senha: '063247'
  },
  {
    id: 'p_129',
    nome: 'TAIS NUNES LEMOS',
    email: 'tais.lemos@prof.ce.gov.br',
    cpf: '610.912.343-96',
    perfil: 'professor',
    status: 'ativo',
    dataCadastro: '2026-01-01T08:00:00Z',
    disciplinasLecionadas: [
      'd_84',
      'd_85',
      'd_86',
      'd_87',
      'd_13',
      'd_14',
      'd_15',
      'd_9',
      'd_27'
    ],
    senha: '610912'
  }
];

export const MOCK_DISCIPLINAS: Disciplina[] = [
  { id: 'd_1', nome: 'AEE MANHÃ', serie: 'Todas', cargaHoraria: 14, status: 'ativa' },
  { id: 'd_2', nome: 'QUÍMICA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_3', nome: 'CNT ENEM', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_4', nome: 'QUÍMICA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_5', nome: 'AP. MAT', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_6', nome: 'MAT ENEM', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_7', nome: 'PCA', serie: 'Todas', cargaHoraria: 9, status: 'ativa' },
  { id: 'd_8', nome: 'MATEMÁTICA', serie: '3ª Série', cargaHoraria: 3, status: 'ativa' },
  { id: 'd_9', nome: 'UCE CNT', serie: 'Todas', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_10', nome: 'ED. FÍSICA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_11', nome: 'ED.FIS. INT', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_12', nome: 'BIOLOGIA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_13', nome: 'ESTUDO ORIENTADO', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_14', nome: 'F. CID', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_15', nome: 'PPDT', serie: '2ª Série', cargaHoraria: 3, status: 'ativa' },
  { id: 'd_16', nome: 'CULTURA DIGITAL', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_17', nome: 'GEOGRAFIA', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_18', nome: 'Coord. Multimeios / Manhã', serie: 'Todas', cargaHoraria: 14, status: 'ativa' },
  { id: 'd_19', nome: 'Coord. Multimeios / Tarde', serie: 'Todas', cargaHoraria: 13, status: 'ativa' },
  { id: 'd_20', nome: 'HISTÓRIA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_21', nome: 'CHS ENEM', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_22', nome: 'HISTÓRIA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_23', nome: 'UCE CHS', serie: 'Todas', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_24', nome: 'AEE TARDE', serie: 'Todas', cargaHoraria: 13, status: 'ativa' },
  { id: 'd_25', nome: 'OPTATIVA', serie: 'Todas', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_26', nome: 'UCE  EPT', serie: 'Todas', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_27', nome: 'UCE  CLUBE', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_28', nome: 'LÍNGUA PORTUGUESA', serie: '3ª Série', cargaHoraria: 3, status: 'ativa' },
  { id: 'd_29', nome: 'UCE  LGG', serie: 'Todas', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_30', nome: 'LÍNGUA PORTUGUESA', serie: '1ª Série', cargaHoraria: 3, status: 'ativa' },
  { id: 'd_31', nome: 'UCE  LGG', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_32', nome: 'IFA LGG', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: 'd_33', nome: 'LGG ENEM', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_34', nome: 'LEI', serie: 'Todas', cargaHoraria: 13, status: 'ativa' },
  { id: 'd_35', nome: 'ARTES', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_36', nome: 'ARTES', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_37', nome: 'ARTES', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_38', nome: 'F. CID', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_39', nome: 'PPDT', serie: '3ª Série', cargaHoraria: 3, status: 'ativa' },
  { id: 'd_40', nome: 'HISTÓRIA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_41', nome: 'CULTURA DIGITAL', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_42', nome: 'EST. ORIENTADO', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_43', nome: 'QUÍMICA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_44', nome: 'ESTUDO ORIENTADO', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_45', nome: 'F. CID', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_46', nome: 'NTPPS', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: 'd_47', nome: 'PPDT', serie: '1ª Série', cargaHoraria: 3, status: 'ativa' },
  { id: 'd_48', nome: 'FILOSOFIA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_49', nome: 'FILOSOFIA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_50', nome: 'FILOSOFIA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_51', nome: 'LEC', serie: 'Todas', cargaHoraria: 15, status: 'ativa' },
  { id: 'd_52', nome: 'BIOLOGIA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_53', nome: 'BIOLOGIA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_54', nome: 'AP. LP', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_55', nome: 'LÍNGUA PORTUGUESA', serie: '2ª Série', cargaHoraria: 3, status: 'ativa' },
  { id: 'd_56', nome: 'MATEMÁTICA', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: 'd_57', nome: 'LÍNGUA ESPANHOLA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_58', nome: 'LÍNGUA INGLESA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_59', nome: 'LÍNGUA ESPANHOLA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_60', nome: 'LÍNGUA INGLESA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_61', nome: 'LÍNGUA ESPANHOLA', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_62', nome: 'LÍNGUA INGLESA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_63', nome: 'CULTURA DIGITAL', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_64', nome: 'GEOGRAFIA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_65', nome: 'IFA CHS', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: 'd_66', nome: 'IFA CNT', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: 'd_67', nome: 'SOCIOLOGIA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_68', nome: 'SOCIOLOGIA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_69', nome: 'SOCIOLOGIA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_70', nome: 'Pedagogo Multimeios / Manhã', serie: 'Todas', cargaHoraria: 20, status: 'ativa' },
  { id: 'd_71', nome: 'Pedagogo Multimeios / Tarde', serie: 'Todas', cargaHoraria: 20, status: 'ativa' },
  { id: 'd_72', nome: 'EST. ORIENTADO', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_73', nome: 'GEOGRAFIA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_74', nome: 'NTPPS', serie: '1ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: 'd_75', nome: 'REDAÇÃO', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_76', nome: 'REDAÇÃO', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_77', nome: 'REDAÇÃO', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_78', nome: 'FÍSICA', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_79', nome: 'NTPPS', serie: '3ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: 'd_80', nome: 'UCE MAT', serie: 'Todas', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_81', nome: 'FÍSICA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_82', nome: 'MATEMÁTICA', serie: '1ª Série', cargaHoraria: 4, status: 'ativa' },
  { id: 'd_83', nome: 'FÍSICA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_84', nome: 'ED. FÍSICA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_85', nome: 'ED. FÍSICA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' },
  { id: 'd_86', nome: 'ED.FIS. INT', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' },
  { id: 'd_87', nome: 'ED.FIS. INT', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' }
];

// Planos mockados
export const MOCK_PLANOS: PlanoAula[] = [
  {
    _id: 'p1',
    professorId: 'p_127',
    professorNome: 'SILAS MICAEL DO NASCIMENTO GOMES',
    disciplina: 'MATEMÁTICA',
    turma: '1ª Série',
    mesAno: '2026-03',
    tema: 'Operações básicas e resolução de problemas',
    qtdAulas: '08 aulas / 400 minutos',
    objetivos: 'Desenvolver o raciocínio lógico-matemático através de operações básicas e resolução de problemas contextualizados.',
    conteudo: 'Números naturais\nAdição e subtração\nProblemas do cotidiano',
    semanas: [
      { numero: 1, abertura: 'Roda de conversa sobre situações cotidianas que envolvem operações matemáticas.', desenvolvimento: 'Aula expositiva com material concreto (blocos lógicos). Atividade em duplas para contagem.', fechamento: 'Socialização das respostas e correção coletiva.' },
      { numero: 2, abertura: 'Pergunta disparadora: "Onde usamos matemática no dia a dia?"', desenvolvimento: 'Jogos matemáticos em grupo. Resolução de problemas no caderno.', fechamento: 'Síntese dos principais conceitos abordados.' },
      { numero: 3, abertura: 'Revisão rápida dos conceitos anteriores com quiz oral.', desenvolvimento: 'Atividade prática: mercadinho simulado para trabalhar adição e subtração.', fechamento: 'Registro das descobertas no caderno.' },
      { numero: 4, abertura: 'Dinâmica de aquecimento com cálculo mental.', desenvolvimento: 'Revisão com quiz interativo e avaliação individual escrita.', fechamento: 'Proposta de atividade para casa e feedback coletivo.' },
    ],
    recursos: 'Blocos lógicos\nQuadro branco\nJogos de tabuleiro\nCédulas e moedas de brinquedo\nProjetor',
    avaliacao: 'Formativa: Observação da participação e envolvimento.\nProcessual: Correção de atividades em duplas e no caderno.\nRegistro: Anotações sobre desempenho para feedback.',
    referencias: 'BRASIL. Base Nacional Comum Curricular (BNCC).\nLivro didático adotado pela escola.',
    status: 'finalizado',
    criadoEm: '2026-02-28T10:00:00Z',
    atualizadoEm: '2026-03-05T14:30:00Z',
  }
];
