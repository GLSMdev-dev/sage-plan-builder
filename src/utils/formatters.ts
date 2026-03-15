/**
 * Formata uma data ISO para o formato brasileiro
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formata mês/ano para exibição (ex: "2026-03" → "Março de 2026")
 */
export const formatMesAno = (mesAno: string): string => {
  if (!mesAno || !mesAno.includes('-')) return 'Data inválida';
  const [ano, mes] = mesAno.split('-');
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return `${meses[parseInt(mes) - 1]} de ${ano}`;
};

/**
 * Retorna o número de semanas em um mês
 */
export const getSemanasDoMes = (mesAno: string): number => {
  if (!mesAno || !mesAno.includes('-')) return 0;
  const [ano, mes] = mesAno.split('-').map(Number);
  const primeiroDia = new Date(ano, mes - 1, 1);
  const ultimoDia = new Date(ano, mes, 0);
  const dias = ultimoDia.getDate();
  const diaSemanaInicio = primeiroDia.getDay();
  return Math.ceil((dias + diaSemanaInicio) / 7);
};
