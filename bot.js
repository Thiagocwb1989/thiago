import { create } from 'venom-bot';
import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

// Supabase configs
const supabase = createClient('https://mrmfxzojroxyqaelsraj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybWZ4em9qcm94eXFhZWxzcmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzEyNTEsImV4cCI6MjA2Nzg0NzI1MX0.TRSmNcf7Cxo11UQx1Jvo4LOU5yE38f8NCMXEf927KsM');

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
