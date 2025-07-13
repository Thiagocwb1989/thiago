import { create } from 'venom-bot';
import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

// Supabase configs
const supabase = createClient('https://SEU-PROJETO.supabase.co', 'SUA-CHAVE');

// Data de hoje
const HOJE = dayjs().format('YYYY-MM-DD');

// Consulta clientes com evento hoje
async function consultarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('data_evento', HOJE);

  if (error) {
    console.error('Erro Supabase:', error.message);
    return [];
  }

  return data;
}

// Inicia o bot
async function iniciarBot() {
  const clientes = await consultarClientes();
  if (!clientes.length) {
    console.log('Nenhum cliente com evento hoje.');
    return;
  }

  create({ session: 'sessao-bot' }).then((client) => {
    clientes.forEach(async (cliente) => {
      const msg = `Olá ${cliente.nome}, hoje é o seu evento! 🎉`;
      const numero = cliente.telefone.replace(/\D/g, '') + '@c.us';
      await client.sendText(numero, msg);
      console.log(`Enviado para ${cliente.nome}`);
    });
  });
}

iniciarBot();
