
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email e senha são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente Supabase com service role para acesso administrativo
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar admin pelo email
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, email, nome, password_hash, ativo')
      .eq('email', email)
      .eq('ativo', true)
      .single();

    if (error || !adminUser) {
      console.log('Admin não encontrado:', error);
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar senha usando função de hash segura do PostgreSQL
    const { data: passwordValid, error: hashError } = await supabase
      .rpc('verify_password', {
        stored_hash: adminUser.password_hash,
        provided_password: password
      });

    if (hashError || !passwordValid) {
      console.log('Senha inválida:', hashError);
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Login bem-sucedido - retornar dados do admin (sem senha)
    const adminData = {
      id: adminUser.id,
      email: adminUser.email,
      nome: adminUser.nome,
      loginTime: new Date().toISOString()
    };

    return new Response(
      JSON.stringify({ success: true, admin: adminData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na validação do login:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
