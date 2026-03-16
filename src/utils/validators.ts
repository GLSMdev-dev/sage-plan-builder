import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255),
  senha: z.string().trim().min(6, 'Senha deve ter no mínimo 6 caracteres').max(100),
});

export const planoAulaSchema = z.object({
  disciplina: z.string().trim().min(1, 'Componente curricular é obrigatório').max(100),
  turma: z.string().trim().min(1, 'Série/Turma é obrigatória').max(50),
  mesAno: z.string().regex(/^\d{4}-\d{2}$/, 'Formato inválido (use AAAA-MM)'),
  tema: z.string().trim().min(1, 'Tema da aula é obrigatório').max(500),
  qtdAulas: z.string().trim().min(1, 'Qtd. de aulas é obrigatória').max(100),
  objetivos: z.string().trim().min(1, 'Objetivos são obrigatórios').max(2000),
  conteudo: z.string().trim().min(1, 'Conteúdo programático é obrigatório').max(2000),
  metodologiaAbertura: z.string().trim().min(1, 'Metodologia de abertura é obrigatória').max(2000),
  metodologiaDesenvolvimento: z.string().trim().min(1, 'Metodologia de desenvolvimento é obrigatória').max(2000),
  metodologiaFechamento: z.string().trim().min(1, 'Metodologia de fechamento é obrigatória').max(2000),
  recursos: z.string().trim().min(1, 'Recursos didáticos são obrigatórios').max(2000),
  avaliacao: z.string().trim().min(1, 'Avaliação é obrigatória').max(2000),
  referencias: z.string().trim().max(2000).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PlanoAulaFormData = z.infer<typeof planoAulaSchema>;
