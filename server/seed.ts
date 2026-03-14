import { db } from './db';
import { usuarios, disciplinas, professorDisciplinas, planosAula, planoSemanas } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';

const DISCIPLINAS_DATA = [
  { id: 1, nome: 'AEE MANHÃ', serie: 'Todas', cargaHoraria: 14, status: 'ativa' as const },
  { id: 2, nome: 'QUÍMICA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 3, nome: 'CNT ENEM', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 4, nome: 'QUÍMICA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 5, nome: 'AP. MAT', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 6, nome: 'MAT ENEM', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 7, nome: 'PCA', serie: 'Todas', cargaHoraria: 9, status: 'ativa' as const },
  { id: 8, nome: 'MATEMÁTICA', serie: '3ª Série', cargaHoraria: 3, status: 'ativa' as const },
  { id: 9, nome: 'UCE CNT', serie: 'Todas', cargaHoraria: 2, status: 'ativa' as const },
  { id: 10, nome: 'ED. FÍSICA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 11, nome: 'ED.FIS. INT', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 12, nome: 'BIOLOGIA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 13, nome: 'ESTUDO ORIENTADO', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 14, nome: 'F. CID', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 15, nome: 'PPDT', serie: '2ª Série', cargaHoraria: 3, status: 'ativa' as const },
  { id: 16, nome: 'CULTURA DIGITAL', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 17, nome: 'GEOGRAFIA', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 18, nome: 'Coord. Multimeios / Manhã', serie: 'Todas', cargaHoraria: 14, status: 'ativa' as const },
  { id: 19, nome: 'Coord. Multimeios / Tarde', serie: 'Todas', cargaHoraria: 13, status: 'ativa' as const },
  { id: 20, nome: 'HISTÓRIA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 21, nome: 'CHS ENEM', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 22, nome: 'HISTÓRIA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 23, nome: 'UCE CHS', serie: 'Todas', cargaHoraria: 2, status: 'ativa' as const },
  { id: 24, nome: 'AEE TARDE', serie: 'Todas', cargaHoraria: 13, status: 'ativa' as const },
  { id: 25, nome: 'OPTATIVA', serie: 'Todas', cargaHoraria: 1, status: 'ativa' as const },
  { id: 26, nome: 'UCE  EPT', serie: 'Todas', cargaHoraria: 2, status: 'ativa' as const },
  { id: 27, nome: 'UCE  CLUBE', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 28, nome: 'LÍNGUA PORTUGUESA', serie: '3ª Série', cargaHoraria: 3, status: 'ativa' as const },
  { id: 29, nome: 'UCE  LGG', serie: 'Todas', cargaHoraria: 2, status: 'ativa' as const },
  { id: 30, nome: 'LÍNGUA PORTUGUESA', serie: '1ª Série', cargaHoraria: 3, status: 'ativa' as const },
  { id: 31, nome: 'UCE  LGG', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 32, nome: 'IFA LGG', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' as const },
  { id: 33, nome: 'LGG ENEM', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 34, nome: 'LEI', serie: 'Todas', cargaHoraria: 13, status: 'ativa' as const },
  { id: 35, nome: 'ARTES', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 36, nome: 'ARTES', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 37, nome: 'ARTES', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 38, nome: 'F. CID', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 39, nome: 'PPDT', serie: '3ª Série', cargaHoraria: 3, status: 'ativa' as const },
  { id: 40, nome: 'HISTÓRIA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 41, nome: 'CULTURA DIGITAL', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 42, nome: 'EST. ORIENTADO', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 43, nome: 'QUÍMICA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 44, nome: 'ESTUDO ORIENTADO', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 45, nome: 'F. CID', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 46, nome: 'NTPPS', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' as const },
  { id: 47, nome: 'PPDT', serie: '1ª Série', cargaHoraria: 3, status: 'ativa' as const },
  { id: 48, nome: 'FILOSOFIA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 49, nome: 'FILOSOFIA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 50, nome: 'FILOSOFIA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 51, nome: 'LEC', serie: 'Todas', cargaHoraria: 15, status: 'ativa' as const },
  { id: 52, nome: 'BIOLOGIA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 53, nome: 'BIOLOGIA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 54, nome: 'AP. LP', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 55, nome: 'LÍNGUA PORTUGUESA', serie: '2ª Série', cargaHoraria: 3, status: 'ativa' as const },
  { id: 56, nome: 'MATEMÁTICA', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' as const },
  { id: 57, nome: 'LÍNGUA ESPANHOLA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 58, nome: 'LÍNGUA INGLESA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 59, nome: 'LÍNGUA ESPANHOLA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 60, nome: 'LÍNGUA INGLESA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 61, nome: 'LÍNGUA ESPANHOLA', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 62, nome: 'LÍNGUA INGLESA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 63, nome: 'CULTURA DIGITAL', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 64, nome: 'GEOGRAFIA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 65, nome: 'IFA CHS', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' as const },
  { id: 66, nome: 'IFA CNT', serie: '2ª Série', cargaHoraria: 4, status: 'ativa' as const },
  { id: 67, nome: 'SOCIOLOGIA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 68, nome: 'SOCIOLOGIA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 69, nome: 'SOCIOLOGIA', serie: '3ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 70, nome: 'Pedagogo Multimeios / Manhã', serie: 'Todas', cargaHoraria: 20, status: 'ativa' as const },
  { id: 71, nome: 'Pedagogo Multimeios / Tarde', serie: 'Todas', cargaHoraria: 20, status: 'ativa' as const },
  { id: 72, nome: 'EST. ORIENTADO', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 73, nome: 'GEOGRAFIA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 74, nome: 'NTPPS', serie: '1ª Série', cargaHoraria: 4, status: 'ativa' as const },
  { id: 75, nome: 'REDAÇÃO', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 76, nome: 'REDAÇÃO', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 77, nome: 'REDAÇÃO', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 78, nome: 'FÍSICA', serie: '3ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 79, nome: 'NTPPS', serie: '3ª Série', cargaHoraria: 4, status: 'ativa' as const },
  { id: 80, nome: 'UCE MAT', serie: 'Todas', cargaHoraria: 2, status: 'ativa' as const },
  { id: 81, nome: 'FÍSICA', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 82, nome: 'MATEMÁTICA', serie: '1ª Série', cargaHoraria: 4, status: 'ativa' as const },
  { id: 83, nome: 'FÍSICA', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 84, nome: 'ED. FÍSICA', serie: '1ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 85, nome: 'ED. FÍSICA', serie: '2ª Série', cargaHoraria: 1, status: 'ativa' as const },
  { id: 86, nome: 'ED.FIS. INT', serie: '1ª Série', cargaHoraria: 2, status: 'ativa' as const },
  { id: 87, nome: 'ED.FIS. INT', serie: '2ª Série', cargaHoraria: 2, status: 'ativa' as const },
];

const USERS_DATA = [
  { id: 1, nome: 'DANIEL DE ARAUJO NUNES', email: 'daniel.nunes@prof.ce.gov.br', cpf: '045.795.333-05', perfil: 'gestor' as const, senha: '045795', discs: [] },
  { id: 2, nome: 'GUILHERME LUIS DOS SANTOS MOREIRA', email: 'guilherme.moreira@prof.ce.gov.br', cpf: '107.116.344-24', perfil: 'gestor' as const, senha: '107116', discs: [] },
  { id: 3, nome: 'ROGERIO GOMES DA SILVA', email: 'rogerio.rgsilva@prof.ce.gov.br', cpf: '022.813.973-27', perfil: 'gestor' as const, senha: '022813', discs: [] },
  { id: 4, nome: 'AMANDA DE SENA GUSMAO', email: 'amanda.gusmao@prof.ce.gov.br', cpf: '075.733.284-60', perfil: 'professor' as const, senha: '075733', discs: [1,2,3,4] },
  { id: 5, nome: 'ANA CRISTINA DE SOUZA LIMA', email: 'ana.lima41@prof.ce.gov.br', cpf: '008.548.263-35', perfil: 'professor' as const, senha: '008548', discs: [5,6,7,8] },
  { id: 6, nome: 'ANDREIA FELIZARDO LIMA', email: 'andreia.lima11@prof.ce.gov.br', cpf: '055.747.663-10', perfil: 'professor' as const, senha: '055747', discs: [9,10,11] },
  { id: 7, nome: 'BRENDA SILVA MARQUES VIEIRA', email: 'brenda.vieira@prof.ce.gov.br', cpf: '074.001.373-44', perfil: 'professor' as const, senha: '074001', discs: [9,12,13,14,15] },
  { id: 8, nome: 'DIEGO CAVALCANTE DE OLIVEIRA', email: 'diego.oliveira2@prof.ce.gov.br', cpf: '034.839.493-48', perfil: 'professor' as const, senha: '034839', discs: [16,17] },
  { id: 9, nome: 'EMANOEL MIRANDA DE OLIVEIRA', email: 'emanoel.oliveira@prof.ce.gov.br', cpf: '813.459.683-53', perfil: 'professor' as const, senha: '813459', discs: [18,19] },
  { id: 10, nome: 'ERIK WILLER ALVES RODRIGUES', email: 'erik.rodrigues@prof.ce.gov.br', cpf: '053.401.543-35', perfil: 'professor' as const, senha: '053401', discs: [20,21,22,23,7] },
  { id: 11, nome: 'FRANCISCA TEIXEIRA RODRIGUES', email: 'francisca.rodrigues10@prof.ce.gov.br', cpf: '022.229.113-38', perfil: 'professor' as const, senha: '022229', discs: [24,25,26,27,28] },
  { id: 12, nome: 'FRANCISCO ALFREDO NICOLAU FILHO', email: 'francisco.filho3@prof.ce.gov.br', cpf: '369.432.663-49', perfil: 'professor' as const, senha: '369432', discs: [29,30,31,32,33] },
  { id: 13, nome: 'HELIO GOMES E SILVA', email: 'helio.silva1@prof.ce.gov.br', cpf: '014.340.963-86', perfil: 'professor' as const, senha: '014340', discs: [34,25,35,36,37,38,39] },
  { id: 14, nome: 'IASMIN CARMO RODRIGUES', email: 'iasmim.rodrigues@prof.ce.gov.br', cpf: '600.884.713-06', perfil: 'professor' as const, senha: '600884', discs: [40] },
  { id: 15, nome: 'ITAERCIO PEREIRA DE LIMA', email: 'itaercio.lima@prof.ce.gov.br', cpf: '064.772.653-03', perfil: 'professor' as const, senha: '064772', discs: [41,42,7,38,39,2,43] },
  { id: 16, nome: 'IVANEIDE ALVES DE ARAUJO', email: 'ivaneide.araujo@prof.ce.gov.br', cpf: '021.543.183-98', perfil: 'professor' as const, senha: '021543', discs: [44,45,46,47,9] },
  { id: 17, nome: 'JOÃO IGOR GOMES DE SOUZA', email: 'joao.souza9@prof.ce.gov.br', cpf: '062.931.163-30', perfil: 'professor' as const, senha: '062931', discs: [48,49,50,23] },
  { id: 18, nome: 'TAMIRES SANTIAGO DOS SANTOS FERNANDES', email: 'tamires.fernandes@prof.ce.gov.br', cpf: '046.187.023-11', perfil: 'professor' as const, senha: '046187', discs: [14,15,66,13] },
  { id: 19, nome: 'LUCICLEIDE CARLOS TEIXEIRA', email: 'lucicleide.teixeira@prof.ce.gov.br', cpf: '515.062.204-44', perfil: 'professor' as const, senha: '515062', discs: [51,52,53] },
  { id: 20, nome: 'LUIZ GOMES DE OLIVEIRA NETO', email: 'luiz.neto3@prof.ce.gov.br', cpf: '037.534.513-20', perfil: 'professor' as const, senha: '037534', discs: [7,29,25,54,55,42] },
  { id: 21, nome: 'MARCOS ANDRÉ QUEIROZ MACHADO', email: 'marcos.machado1@prof.ce.gov.br', cpf: '071.695.593-82', perfil: 'professor' as const, senha: '071695', discs: [42,38,56,39] },
  { id: 22, nome: 'MARCOS JOSE BENTO', email: 'marcos.bento@prof.ce.gov.br', cpf: '479.431.303-91', perfil: 'professor' as const, senha: '479431', discs: [26,57,58,27,59,60,61,62] },
  { id: 23, nome: 'MARIA JACKELINE PEREIRA DE LIMA', email: 'maria.lima200@prof.ce.gov.br', cpf: '077.910.523-00', perfil: 'professor' as const, senha: '077910', discs: [63,64,23,65] },
  { id: 24, nome: 'MIKAEL FERREIRA DE LIMA', email: 'mikael.lima@prof.ce.gov.br', cpf: '080.545.943-05', perfil: 'professor' as const, senha: '080545', discs: [67,68,69] },
  { id: 25, nome: 'MORGANIA ALVES DE AMORIM', email: 'morgania.amorim@prof.ce.gov.br', cpf: '429.777.033-49', perfil: 'professor' as const, senha: '429777', discs: [70,71] },
  { id: 26, nome: 'NACIZO CANDIDO NETO', email: 'nacizo.neto@prof.ce.gov.br', cpf: '044.681.613-29', perfil: 'professor' as const, senha: '044681', discs: [72,45,73,47] },
  { id: 27, nome: 'NÁJILA RAQUEL MOREIRA DA SILVA', email: 'najila.silva@prof.ce.gov.br', cpf: '033.842.803-85', perfil: 'professor' as const, senha: '033842', discs: [74,46] },
  { id: 28, nome: 'PAULO VICTOR ARAUJO RICARTE', email: 'paulo.araujo5@prof.ce.gov.br', cpf: '032.354.363-40', perfil: 'professor' as const, senha: '032354', discs: [34,25,75,76,77] },
  { id: 29, nome: 'REGILANIA OLIVEIRA DO NASCIMENTO', email: 'regilania.nascimento@prof.ce.gov.br', cpf: '062.935.073-63', perfil: 'professor' as const, senha: '062935', discs: [25,44,45,47,78] },
  { id: 30, nome: 'RENATO SIQUEIRA', email: 'renato.siqueira@prof.ce.gov.br', cpf: '014.025.933-33', perfil: 'professor' as const, senha: '014025', discs: [79,80] },
  { id: 31, nome: 'SILAS MICAEL DO NASCIMENTO GOMES', email: 'silas.gomes@prof.ce.gov.br', cpf: '035.449.533-07', perfil: 'professor' as const, senha: '035449', discs: [25,51,81,82,80,83] },
  { id: 32, nome: 'THAIANA MAGNA MOURA SALDANHA', email: 'thaiana.saldanha@prof.ce.gov.br', cpf: '063.247.803-92', perfil: 'professor' as const, senha: '063247', discs: [51,83] },
  { id: 33, nome: 'TAIS NUNES LEMOS', email: 'tais.lemos@prof.ce.gov.br', cpf: '610.912.343-96', perfil: 'professor' as const, senha: '610912', discs: [84,85,86,87,13,14,15,9,27] },
];

export async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Truncate and reset sequences
  await db.execute(sql`TRUNCATE TABLE plano_semanas, planos_aula, professor_disciplinas, usuarios, disciplinas RESTART IDENTITY CASCADE`);

  // Insert disciplinas
  console.log('  Inserindo disciplinas...');
  for (const d of DISCIPLINAS_DATA) {
    await db.execute(sql`INSERT INTO disciplinas (id, nome, serie, carga_horaria, status, cor) VALUES (${d.id}, ${d.nome}, ${d.serie}, ${d.cargaHoraria}, ${d.status}, '#3b82f6')`);
  }
  await db.execute(sql`SELECT setval('disciplinas_id_seq', (SELECT MAX(id) FROM disciplinas))`);

  // Insert usuarios
  console.log('  Inserindo usuários...');
  for (const u of USERS_DATA) {
    const hash = await bcrypt.hash(u.senha, 10);
    const usuario = u.email.split('@')[0];
    await db.execute(sql`INSERT INTO usuarios (id, nome, email, usuario, cpf, senha_hash, perfil, status) VALUES (${u.id}, ${u.nome}, ${u.email}, ${usuario}, ${u.cpf}, ${hash}, ${u.perfil}, 'ativo')`);
    for (const discId of u.discs) {
      await db.execute(sql`INSERT INTO professor_disciplinas (professor_id, disciplina_id) VALUES (${u.id}, ${discId})`);
    }
  }
  await db.execute(sql`SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios))`);

  // Insert sample plano de aula
  console.log('  Inserindo plano de aula de exemplo...');
  const [plano] = await db.insert(planosAula).values({
    professorId: 31,
    professorNome: 'SILAS MICAEL DO NASCIMENTO GOMES',
    disciplinaNome: 'MATEMÁTICA',
    turma: '1ª Série',
    mesAno: '2026-03',
    objetivos: 'Desenvolver o raciocínio lógico-matemático através de operações básicas e resolução de problemas contextualizados.',
    conteudo: 'Números naturais, adição e subtração, problemas do cotidiano.',
    avaliacao: 'Avaliação contínua através de exercícios em sala e participação.',
    status: 'finalizado',
    criadoEm: new Date('2026-02-28T10:00:00Z'),
    atualizadoEm: new Date('2026-03-05T14:30:00Z'),
  }).returning();

  await db.insert(planoSemanas).values([
    { planoId: plano.id, numero: 1, metodologia: 'Aula expositiva com material concreto (blocos lógicos). Atividade em duplas para contagem.', recursos: 'Blocos lógicos, quadro branco, fichas numeradas.' },
    { planoId: plano.id, numero: 2, metodologia: 'Jogos matemáticos em grupo. Resolução de problemas no caderno.', recursos: 'Jogos de tabuleiro, caderno, lápis coloridos.' },
    { planoId: plano.id, numero: 3, metodologia: 'Atividade prática: mercadinho simulado para trabalhar adição e subtração.', recursos: 'Cédulas e moedas de brinquedo, etiquetas de preço.' },
    { planoId: plano.id, numero: 4, metodologia: 'Revisão com quiz interativo e avaliação individual escrita.', recursos: 'Projetor, folhas de avaliação impressas.' },
  ]);

  console.log('✅ Seed concluído com sucesso!');
}

// Allow running directly as a script
if (process.argv[1]?.includes('seed')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
  });
}
