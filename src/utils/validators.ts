import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255),
  senha: z.string().trim().min(6, 'Senha deve ter no mínimo 6 caracteres').max(100),
});

export const planoAulaSchema = z.object({
  disciplina: z.string().trim().min(1, 'Disciplina é obrigatória').max(100),
  turma: z.string().trim().min(1, 'Turma é obrigatória').max(50),
  mesAno: z.string().regex(/^\d{4}-\d{2}$/, 'Formato inválido (use AAAA-MM)'),
  objetivos: z.string().trim().min(1, 'Objetivos são obrigatórios').max(2000),
  conteudo: z.string().trim().min(1, 'Conteúdo é obrigatório').max(2000),
  avaliacao: z.string().trim().min(1, 'Avaliação é obrigatória').max(2000),
  semanas: z.array(z.object({
    numero: z.number().min(1).max(6),
    metodologia: z.string().trim().min(1, 'Metodologia é obrigatória').max(2000),
    recursos: z.string().trim().min(1, 'Recursos são obrigatórios').max(1000),
  })).min(1, 'Pelo menos uma semana é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PlanoAulaFormData = z.infer<typeof planoAulaSchema>;
