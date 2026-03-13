import { pgTable, serial, varchar, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const perfilEnum = pgEnum('perfil', ['professor', 'gestor']);
export const statusUsuarioEnum = pgEnum('status_usuario', ['ativo', 'inativo']);
export const statusDisciplinaEnum = pgEnum('status_disciplina', ['ativa', 'inativa']);
export const statusPlanoEnum = pgEnum('status_plano', ['rascunho', 'finalizado']);

export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  cpf: varchar('cpf', { length: 20 }),
  senhaHash: varchar('senha_hash', { length: 255 }).notNull(),
  perfil: perfilEnum('perfil').notNull().default('professor'),
  status: statusUsuarioEnum('status').notNull().default('ativo'),
  dataCadastro: timestamp('data_cadastro').notNull().defaultNow(),
});

export const disciplinas = pgTable('disciplinas', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  codigo: varchar('codigo', { length: 50 }),
  cor: varchar('cor', { length: 20 }).default('#3b82f6'),
  serie: varchar('serie', { length: 50 }).notNull(),
  cargaHoraria: integer('carga_horaria').notNull().default(0),
  status: statusDisciplinaEnum('status').notNull().default('ativa'),
});

export const professorDisciplinas = pgTable('professor_disciplinas', {
  professorId: integer('professor_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  disciplinaId: integer('disciplina_id').notNull().references(() => disciplinas.id, { onDelete: 'cascade' }),
});

export const planosAula = pgTable('planos_aula', {
  id: serial('id').primaryKey(),
  professorId: integer('professor_id').notNull().references(() => usuarios.id),
  professorNome: varchar('professor_nome', { length: 255 }).notNull(),
  disciplinaNome: varchar('disciplina_nome', { length: 255 }).notNull(),
  turma: varchar('turma', { length: 50 }).notNull(),
  mesAno: varchar('mes_ano', { length: 7 }).notNull(),
  objetivos: text('objetivos').notNull(),
  conteudo: text('conteudo').notNull(),
  avaliacao: text('avaliacao').notNull(),
  status: statusPlanoEnum('status').notNull().default('rascunho'),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
  atualizadoEm: timestamp('atualizado_em').notNull().defaultNow(),
});

export const planoSemanas = pgTable('plano_semanas', {
  id: serial('id').primaryKey(),
  planoId: integer('plano_id').notNull().references(() => planosAula.id, { onDelete: 'cascade' }),
  numero: integer('numero').notNull(),
  metodologia: text('metodologia').notNull(),
  recursos: text('recursos').notNull(),
});

export const insertUsuarioSchema = createInsertSchema(usuarios).omit({ id: true, dataCadastro: true });
export const insertDisciplinaSchema = createInsertSchema(disciplinas).omit({ id: true });
export const insertPlanoSchema = createInsertSchema(planosAula).omit({ id: true, criadoEm: true, atualizadoEm: true });
export const insertSemanaSchema = createInsertSchema(planoSemanas).omit({ id: true });

export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Usuario = typeof usuarios.$inferSelect;
export type InsertDisciplina = z.infer<typeof insertDisciplinaSchema>;
export type Disciplina = typeof disciplinas.$inferSelect;
export type InsertPlano = z.infer<typeof insertPlanoSchema>;
export type PlanoAula = typeof planosAula.$inferSelect;
export type PlanoSemana = typeof planoSemanas.$inferSelect;
