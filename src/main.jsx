import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{createClient}from'@supabase/supabase-js';
import{Mail,Lock,ArrowRight,Eye,EyeOff,LogOut,LayoutDashboard,Building2,Users,Wallet,CreditCard,MessageSquare,TriangleAlert,FileText,CalendarDays,Menu,X,Plus,ChevronRight,KeyRound,UserPlus,Phone,Home}from'lucide-react';
import'./style.css';

const rawUrl=import.meta.env.VITE_SUPABASE_URL;
const url=rawUrl?.replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'');
const key=import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase=url&&key?createClient(url,key):null;

const modules=[
  {id:'dashboard',label:'Visão geral',icon:LayoutDashboard},
  {id:'condominios',label:'Condomínios',icon:Building2},
  {id:'moradores',label:'Unidades e moradores',icon:Users},
  {id:'financeiro',label:'Financeiro',icon:Wallet},
  {id:'cobrancas',label:'Cobranças',icon:CreditCard},
  {id:'comunicados',label:'Comunicados',icon:MessageSquare},
  {id:'ocorrencias',label:'Ocorrências',icon:TriangleAlert},
  {id:'documentos',label:'Documentos',icon:FileText},
  {id:'reservas',label:'Reservas',icon:CalendarDays},
];

const emptyCopy={
  condominios:['Condomínios','Cadastre e acompanhe os condomínios administrados.','Cadastrar condomínio'],
  moradores:['Unidades e moradores','Organize blocos, apartamentos, proprietários e moradores.','Adicionar unidade'],
  financeiro:['Financeiro','Acompanhe receitas, despesas, saldo e prestação de contas.','Lançar movimentação'],
  cobrancas:['Cobranças','Controle taxas condominiais, vencimentos e inadimplência.','Criar cobrança'],
  comunicados:['Comunicados','Publique avisos e mantenha moradores informados.','Novo comunicado'],
  ocorrencias:['Ocorrências','Registre solicitações, incidentes e acompanhe resoluções.','Nova ocorrência'],
  documentos:['Documentos','Centralize atas, contratos, regulamentos e comprovantes.','Adicionar documento'],
  reservas:['Reservas','Gerencie salão de festas, churrasqueira e outras áreas comuns.','Nova reserva'],
};

function Dashboard({session,onLogout,busy}){
  const[active,setActive]=useState('dashboard');
  const[menuOpen,setMenuOpen]=useState(false);
  const userName=session.user?.user_metadata?.nome||session.user?.email?.split('@')[0]||'Administrador';
  const current=modules.find(item=>item.id===active);
  const cards=[
    ['Condomínios','0','Nenhum cadastrado',Building2,'condominios'],
    ['Unidades','0','Cadastre blocos e apartamentos',Home,'moradores'],
    ['Receitas do mês','R$ 0,00','Sem lançamentos',Wallet,'financeiro'],
    ['Pendências','0','Nenhuma cobrança em atraso',TriangleAlert,'cobrancas'],
  ];
  const select=id=>{setActive(id);setMenuOpen(false)};
  return <main className="app-shell">
    <aside className={`sidebar ${menuOpen?'open':''}`}>
      <div className="side-brand"><img src="/pem-condominios-logo.jpg" alt="PEM Condomínios"/><div><strong>PEM</strong><span>Condomínios</span></div><button className="side-close" onClick={()=>setMenuOpen(false)}><X size={20}/></button></div>
      <nav>{modules.map(({id,label,icon:Icon})=><button key={id} className={active===id?'active':''} onClick={()=>select(id)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      <div className="side-user"><div className="avatar">{userName.slice(0,1).toUpperCase()}</div><div><strong>{userName}</strong><span>{session.user?.email}</span></div></div>
      <button className="side-logout" onClick={onLogout} disabled={busy}><LogOut size={18}/>Sair</button>
    </aside>
    {menuOpen&&<button className="sidebar-backdrop" aria-label="Fechar menu" onClick={()=>setMenuOpen(false)}/>} 
    <section className="workspace">
      <header className="topbar"><button className="menu-btn" onClick={()=>setMenuOpen(true)}><Menu size={22}/></button><div><span>ADMINISTRAÇÃO CONDOMINIAL</span><h1>{current?.label}</h1></div><div className="top-user"><div className="avatar">{userName.slice(0,1).toUpperCase()}</div><div><strong>{userName}</strong><span>Administrador</span></div></div></header>
      <div className="workspace-body">
        {active==='dashboard'?<>
          <section className="hero-panel"><div><span>PAINEL ADMINISTRATIVO</span><h2>Bem-vindo ao PEM Condomínios</h2><p>Seu ambiente central para administrar operação, moradores, finanças e comunicação do condomínio.</p></div><button onClick={()=>select('condominios')}><Plus size={18}/>Cadastrar condomínio</button></section>
          <section className="metric-grid">{cards.map(([title,value,caption,Icon,target])=><button className="metric-card" key={title} onClick={()=>select(target)}><div className="metric-icon"><Icon size={22}/></div><span>{title}</span><strong>{value}</strong><small>{caption}</small><ChevronRight size={18} className="metric-arrow"/></button>)}</section>
          <section className="dashboard-grid"><div className="panel"><div className="panel-title"><div><span>ATALHOS</span><h3>Comece por aqui</h3></div></div><div className="quick-grid"><button onClick={()=>select('condominios')}><Building2 size={22}/><div><strong>Novo condomínio</strong><span>Cadastre o primeiro empreendimento</span></div></button><button onClick={()=>select('moradores')}><Users size={22}/><div><strong>Unidades e moradores</strong><span>Organize blocos e responsáveis</span></div></button><button onClick={()=>select('financeiro')}><Wallet size={22}/><div><strong>Financeiro</strong><span>Registre receitas e despesas</span></div></button><button onClick={()=>select('comunicados')}><MessageSquare size={22}/><div><strong>Comunicado</strong><span>Envie um aviso aos moradores</span></div></button></div></div><div className="panel status-panel"><div className="panel-title"><div><span>SISTEMA</span><h3>Status da operação</h3></div></div><div className="status-row"><span className="status-dot"/><div><strong>Ambiente ativo</strong><small>Autenticação conectada</small></div></div><div className="status-row"><span className="status-dot muted"/><div><strong>Base aguardando dados</strong><small>Cadastre o primeiro condomínio</small></div></div></div></section>
        </>:<ModuleEmpty data={emptyCopy[active]} icon={current?.icon}/>} 
      </div>
    </section>
  </main>;
}

function ModuleEmpty({data,icon:Icon}){
  if(!data)return null;
  return <section className="module-page"><div className="module-head"><div className="module-icon">{Icon&&<Icon size={28}/>}</div><div><span>MÓDULO</span><h2>{data[0]}</h2><p>{data[1]}</p></div></div><div className="empty-state"><div className="empty-symbol">{Icon&&<Icon size={34}/>}</div><h3>Nenhum registro ainda</h3><p>{data[1]}</p><button><Plus size={18}/>{data[2]}</button></div></section>;
}

function AuthScreen(){
  const[mode,setMode]=useState('login');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[showPassword,setShowPassword]=useState(false);
  const[name,setName]=useState('');
  const[phone,setPhone]=useState('');
  const[condominio,setCondominio]=useState('');
  const[msg,setMsg]=useState('');
  const[busy,setBusy]=useState(false);
  const title=mode==='login'?'Bem-vindo':mode==='signup'?'Criar conta':'Recuperar senha';
  const description=mode==='login'?'Administração organizada, informação clara e controle em um só lugar.':mode==='signup'?'Preencha seus dados para iniciar o acesso ao PEM Condomínios.':'Informe seu e-mail e enviaremos o link para criar uma nova senha.';
  async function submit(e){
    e.preventDefault();
    if(!supabase){setMsg('Configuração do banco não encontrada.');return}
    setBusy(true);setMsg('');
    if(mode==='login'){
      const{error}=await supabase.auth.signInWithPassword({email,password});
      setMsg(error?'Não foi possível entrar. Verifique o e-mail e a senha.':'');
    }else if(mode==='signup'){
      const{error}=await supabase.auth.signUp({email,password,options:{data:{nome:name,telefone:phone,condominio}}});
      setMsg(error?error.message:'Cadastro enviado. Confira seu e-mail para confirmar a conta.');
    }else{
      const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
      setMsg(error?error.message:'Link de recuperação enviado. Confira seu e-mail.');
    }
    setBusy(false);
  }
  function changeMode(next){setMode(next);setMsg('');setPassword('')}
  return <main className="page"><section className="brand"><img className="brand-logo" src="/pem-condominios-logo.jpg" alt="PEM Condomínios - Gestão Condominial Inteligente"/></section><section className="card"><div className="intro"><span>GESTÃO CONDOMINIAL</span><h2>{title}</h2><p>{description}</p></div><form onSubmit={submit}>
    {mode==='signup'&&<><label>Nome completo<div className="field"><UserPlus size={18}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" required/></div></label><label>Telefone<div className="field"><Phone size={18}/><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(81) 99999-9999" required/></div></label><label>Condomínio / empresa<div className="field"><Building2 size={18}/><input value={condominio} onChange={e=>setCondominio(e.target.value)} placeholder="Nome do condomínio ou administradora" required/></div></label></>}
    <label>E-mail<div className="field"><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" required/></div></label>
    {mode!=='forgot'&&<label>Senha<div className="field"><Lock size={18}/><input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" minLength={6} required/><button type="button" className="password-toggle" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>}
    {mode==='login'&&<button type="button" className="forgot-link" onClick={()=>changeMode('forgot')}><KeyRound size={15}/>Esqueci minha senha</button>}
    <button type="submit" disabled={busy}>{busy?'Aguarde...':mode==='login'?'Entrar':mode==='signup'?'Criar conta':'Enviar recuperação'}<ArrowRight size={18}/></button>{msg&&<div className="msg">{msg}</div>}
  </form><div className="auth-switch">{mode==='login'?<><span>Ainda não tem acesso?</span><button onClick={()=>changeMode('signup')}>Criar conta</button></>:<><span>{mode==='forgot'?'Lembrou sua senha?':'Já possui cadastro?'}</span><button onClick={()=>changeMode('login')}>Voltar para entrar</button></>}</div><small>PEM Condomínios · Gestão Condominial Inteligente</small></section></main>;
}

function App(){
  const[session,setSession]=useState(null);
  const[loadingSession,setLoadingSession]=useState(true);
  const[busy,setBusy]=useState(false);
  useEffect(()=>{if(!supabase){setLoadingSession(false);return}supabase.auth.getSession().then(({data})=>{setSession(data.session||null);setLoadingSession(false)});const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>setSession(nextSession||null));return()=>subscription.unsubscribe()},[]);
  async function logout(){if(!supabase)return;setBusy(true);await supabase.auth.signOut();setSession(null);setBusy(false)}
  if(loadingSession)return <main className="loading-page">Carregando...</main>;
  return session?<Dashboard session={session} onLogout={logout} busy={busy}/>:<AuthScreen/>;
}

createRoot(document.getElementById('root')).render(<App/>);
