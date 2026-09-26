import React,{useCallback,useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{createClient}from'@supabase/supabase-js';
import{Mail,Lock,ArrowRight,Eye,EyeOff,LogOut,LayoutDashboard,Building2,Users,Wallet,CreditCard,MessageSquare,TriangleAlert,FileText,CalendarDays,Menu,X,Plus,ChevronRight,KeyRound,UserPlus,Phone,Home,Save,Search,MapPin,Car,Dog,UserRound,RefreshCw}from'lucide-react';
import'./style.css';
import'./app.css';

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

const moduleCopy={
  financeiro:['Financeiro','Registre receitas, despesas, competência e vencimentos.'],
  cobrancas:['Cobranças','Cadastre taxas, vencimentos e acompanhe a inadimplência.'],
  comunicados:['Comunicados','Publique avisos para os moradores do condomínio.'],
  ocorrencias:['Ocorrências','Registre solicitações, incidentes e responsáveis pelo atendimento.'],
  documentos:['Documentos','Centralize atas, regulamentos, contratos e links de arquivos.'],
  reservas:['Reservas','Cadastre áreas comuns e reservas vinculadas à unidade ou morador.'],
};

function Field({label,children,wide=false}){return <label className={wide?'form-field wide':'form-field'}><span>{label}</span>{children}</label>}
function Input(props){return <input className="control" {...props}/>}
function Select(props){return <select className="control" {...props}/>}
function Textarea(props){return <textarea className="control textarea" {...props}/>}
function Button({children,secondary=false,...props}){return <button className={secondary?'action-btn secondary':'action-btn'} {...props}>{children}</button>}
function Empty({icon:Icon,title,text,action,onClick}){return <div className="empty-state compact"><div className="empty-symbol">{Icon&&<Icon size={32}/>}</div><h3>{title}</h3><p>{text}</p>{action&&<Button onClick={onClick}><Plus size={18}/>{action}</Button>}</div>}

function useWorkspaceData(){
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState('');
  const[condos,setCondos]=useState([]);
  const[blocks,setBlocks]=useState([]);
  const[units,setUnits]=useState([]);
  const[people,setPeople]=useState([]);
  const[links,setLinks]=useState([]);
  const[areas,setAreas]=useState([]);
  const[reservations,setReservations]=useState([]);
  const[finance,setFinance]=useState([]);
  const[charges,setCharges]=useState([]);
  const[notices,setNotices]=useState([]);
  const[issues,setIssues]=useState([]);
  const[docs,setDocs]=useState([]);

  const refresh=useCallback(async()=>{
    if(!supabase){setLoading(false);setError('Configuração do banco não encontrada.');return}
    setLoading(true);setError('');
    const queries=[
      supabase.from('condominios').select('*').order('created_at',{ascending:false}),
      supabase.from('blocos').select('*').order('ordem'),
      supabase.from('unidades').select('*').order('identificacao'),
      supabase.from('pessoas').select('*').order('nome'),
      supabase.from('unidade_pessoas').select('*').eq('ativo',true),
      supabase.from('areas_comuns').select('*').eq('ativo',true).order('nome'),
      supabase.from('reservas').select('*').order('inicio_em',{ascending:false}).limit(100),
      supabase.from('movimentacoes_financeiras').select('*').order('created_at',{ascending:false}).limit(100),
      supabase.from('cobrancas').select('*').order('vencimento',{ascending:false}).limit(100),
      supabase.from('comunicados').select('*').order('created_at',{ascending:false}).limit(100),
      supabase.from('chamados').select('*').order('created_at',{ascending:false}).limit(100),
      supabase.from('documentos').select('*').order('created_at',{ascending:false}).limit(100),
    ];
    const results=await Promise.all(queries);
    const firstError=results.find(r=>r.error)?.error;
    if(firstError)setError(firstError.message);
    const [c,b,u,p,l,a,r,f,ch,n,i,d]=results.map(r=>r.data||[]);
    setCondos(c);setBlocks(b);setUnits(u);setPeople(p);setLinks(l);setAreas(a);setReservations(r);setFinance(f);setCharges(ch);setNotices(n);setIssues(i);setDocs(d);
    setLoading(false);
  },[]);

  useEffect(()=>{refresh()},[refresh]);
  return{loading,error,condos,blocks,units,people,links,areas,reservations,finance,charges,notices,issues,docs,refresh};
}

function Dashboard({session,onLogout,busy}){
  const[active,setActive]=useState('dashboard');
  const[menuOpen,setMenuOpen]=useState(false);
  const data=useWorkspaceData();
  const userName=session.user?.user_metadata?.nome||session.user?.email?.split('@')[0]||'Administrador';
  const current=modules.find(item=>item.id===active);
  const residentCount=useMemo(()=>data.links.filter(x=>x.reside).length,[data.links]);
  const pendingCharges=useMemo(()=>data.charges.filter(x=>!['paga','cancelada'].includes(x.status)).length,[data.charges]);
  const balance=useMemo(()=>data.finance.reduce((sum,x)=>sum+(x.tipo==='receita'?Number(x.valor||0):-Number(x.valor||0)),0),[data.finance]);
  const cards=[
    ['Condomínios',String(data.condos.length),data.condos.length?'Empreendimentos cadastrados':'Nenhum cadastrado',Building2,'condominios'],
    ['Moradores',String(residentCount),data.units.length?`${data.units.length} unidades cadastradas`:'Cadastre blocos e apartamentos',Home,'moradores'],
    ['Saldo lançado',balance.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}),'Receitas menos despesas',Wallet,'financeiro'],
    ['Cobranças abertas',String(pendingCharges),pendingCharges?'Acompanhe os vencimentos':'Nenhuma pendência',TriangleAlert,'cobrancas'],
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
      <header className="topbar"><button className="menu-btn" onClick={()=>setMenuOpen(true)}><Menu size={22}/></button><div><span>ADMINISTRAÇÃO CONDOMINIAL</span><h1>{current?.label}</h1></div><div className="top-actions"><button className="refresh-btn" onClick={data.refresh} title="Atualizar"><RefreshCw size={18}/></button><div className="top-user"><div className="avatar">{userName.slice(0,1).toUpperCase()}</div><div><strong>{userName}</strong><span>Administrador</span></div></div></div></header>
      <div className="workspace-body">
        {data.error&&<div className="system-error">{data.error}</div>}
        {active==='dashboard'?<>
          <section className="hero-panel"><div><span>PAINEL ADMINISTRATIVO</span><h2>Bem-vindo ao PEM Condomínios</h2><p>Cadastre o condomínio, organize unidades e moradores e mantenha reservas, cobranças, ocorrências e comunicação no mesmo lugar.</p></div><button onClick={()=>select('condominios')}><Plus size={18}/>Cadastrar condomínio</button></section>
          <section className="metric-grid">{cards.map(([title,value,caption,Icon,target])=><button className="metric-card" key={title} onClick={()=>select(target)}><div className="metric-icon"><Icon size={22}/></div><span>{title}</span><strong>{data.loading?'…':value}</strong><small>{caption}</small><ChevronRight size={18} className="metric-arrow"/></button>)}</section>
          <section className="dashboard-grid"><div className="panel"><div className="panel-title"><div><span>ATALHOS</span><h3>Comece por aqui</h3></div></div><div className="quick-grid"><button onClick={()=>select('condominios')}><Building2 size={22}/><div><strong>Novo condomínio</strong><span>Nome, CNPJ, endereço e responsável</span></div></button><button onClick={()=>select('moradores')}><Users size={22}/><div><strong>Unidade e morador</strong><span>Bloco, apartamento, proprietário ou inquilino</span></div></button><button onClick={()=>select('reservas')}><CalendarDays size={22}/><div><strong>Reserva</strong><span>Salão, churrasqueira e áreas comuns</span></div></button><button onClick={()=>select('cobrancas')}><CreditCard size={22}/><div><strong>Cobrança</strong><span>Taxas e vencimentos por unidade</span></div></button></div></div><div className="panel status-panel"><div className="panel-title"><div><span>SISTEMA</span><h3>Status da operação</h3></div></div><div className="status-row"><span className="status-dot"/><div><strong>Banco conectado</strong><small>Cadastros com persistência no Supabase</small></div></div><div className="status-row"><span className="status-dot"/><div><strong>Módulos ligados</strong><small>Condomínios, unidades, moradores e operação</small></div></div></div></section>
        </>:active==='condominios'?<CondominiosPage data={data}/>:active==='moradores'?<MoradoresPage data={data}/>:<OperationalPage id={active} data={data}/>} 
      </div>
    </section>
  </main>;
}

function PageHead({icon:Icon,title,description,action,onAction}){
  return <section className="module-head"><div className="module-icon"><Icon size={28}/></div><div className="grow"><span>MÓDULO</span><h2>{title}</h2><p>{description}</p></div>{action&&<Button onClick={onAction}><Plus size={18}/>{action}</Button>}</section>
}

function CondominiosPage({data}){
  const[showForm,setShowForm]=useState(data.condos.length===0);
  const[msg,setMsg]=useState('');
  const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({nome:'',cnpj:'',tipo:'residencial',email:'',telefone:'',cep:'',logradouro:'',numero:'',bairro:'',cidade:'',estado:'PE',quantidade_unidades:'',observacoes:'',responsavel_nome:'',responsavel_papel:'sindico',responsavel_email:'',responsavel_telefone:''});
  const set=(k,v)=>setForm(s=>({...s,[k]:v}));
  async function save(e){
    e.preventDefault();setSaving(true);setMsg('');
    try{
      const{data:empresaId,error:bootErr}=await supabase.rpc('bootstrap_empresa',{p_nome:`Administração ${form.nome}`});
      if(bootErr)throw bootErr;
      const payload={empresa_id:empresaId,nome:form.nome.trim(),cnpj:form.cnpj||null,tipo:form.tipo,email:form.email||null,telefone:form.telefone||null,cep:form.cep||null,logradouro:form.logradouro||null,numero:form.numero||null,bairro:form.bairro||null,cidade:form.cidade.trim(),estado:form.estado.trim().toUpperCase(),quantidade_unidades:Number(form.quantidade_unidades||0),observacoes:form.observacoes||null};
      const{data:condo,error}=await supabase.from('condominios').insert(payload).select().single();
      if(error)throw error;
      if(form.responsavel_nome.trim()){
        const{data:pessoa,error:pessoaErr}=await supabase.from('pessoas').insert({empresa_id:empresaId,nome:form.responsavel_nome.trim(),email:form.responsavel_email||null,telefone:form.responsavel_telefone||null}).select().single();
        if(pessoaErr)throw pessoaErr;
        const{error:linkErr}=await supabase.from('condominio_responsaveis').insert({empresa_id:empresaId,condominio_id:condo.id,pessoa_id:pessoa.id,papel:form.responsavel_papel,principal:true});
        if(linkErr)throw linkErr;
      }
      setMsg('Condomínio cadastrado com sucesso.');
      setForm({nome:'',cnpj:'',tipo:'residencial',email:'',telefone:'',cep:'',logradouro:'',numero:'',bairro:'',cidade:'',estado:'PE',quantidade_unidades:'',observacoes:'',responsavel_nome:'',responsavel_papel:'sindico',responsavel_email:'',responsavel_telefone:''});
      await data.refresh();setShowForm(false);
    }catch(err){setMsg(err.message||'Não foi possível salvar.')}finally{setSaving(false)}
  }
  return <section className="module-page">
    <PageHead icon={Building2} title="Condomínios" description="Cadastre cada empreendimento com dados oficiais, endereço e responsável principal." action="Cadastrar condomínio" onAction={()=>setShowForm(v=>!v)}/>
    {showForm&&<form className="data-form panel" onSubmit={save}><div className="form-title"><div><span>CADASTRO</span><h3>Novo condomínio</h3></div></div><div className="form-grid">
      <Field label="Nome do condomínio"><Input value={form.nome} onChange={e=>set('nome',e.target.value)} required placeholder="Ex.: Residencial Boa Vista"/></Field>
      <Field label="CNPJ"><Input value={form.cnpj} onChange={e=>set('cnpj',e.target.value)} placeholder="00.000.000/0001-00"/></Field>
      <Field label="Tipo"><Select value={form.tipo} onChange={e=>set('tipo',e.target.value)}><option value="residencial">Residencial</option><option value="comercial">Comercial</option><option value="misto">Misto</option></Select></Field>
      <Field label="Quantidade de unidades"><Input type="number" min="0" value={form.quantidade_unidades} onChange={e=>set('quantidade_unidades',e.target.value)}/></Field>
      <Field label="E-mail"><Input type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></Field>
      <Field label="Telefone"><Input value={form.telefone} onChange={e=>set('telefone',e.target.value)}/></Field>
      <Field label="CEP"><Input value={form.cep} onChange={e=>set('cep',e.target.value)}/></Field>
      <Field label="Logradouro"><Input value={form.logradouro} onChange={e=>set('logradouro',e.target.value)}/></Field>
      <Field label="Número"><Input value={form.numero} onChange={e=>set('numero',e.target.value)}/></Field>
      <Field label="Bairro"><Input value={form.bairro} onChange={e=>set('bairro',e.target.value)}/></Field>
      <Field label="Cidade"><Input value={form.cidade} onChange={e=>set('cidade',e.target.value)} required/></Field>
      <Field label="UF"><Input maxLength="2" value={form.estado} onChange={e=>set('estado',e.target.value)} required/></Field>
      <div className="form-divider wide"><span>RESPONSÁVEL PRINCIPAL</span></div>
      <Field label="Nome do responsável"><Input value={form.responsavel_nome} onChange={e=>set('responsavel_nome',e.target.value)} placeholder="Síndico ou administrador"/></Field>
      <Field label="Função"><Select value={form.responsavel_papel} onChange={e=>set('responsavel_papel',e.target.value)}><option value="sindico">Síndico</option><option value="subsindico">Subsíndico</option><option value="administrador">Administrador</option><option value="conselheiro">Conselheiro</option></Select></Field>
      <Field label="E-mail do responsável"><Input type="email" value={form.responsavel_email} onChange={e=>set('responsavel_email',e.target.value)}/></Field>
      <Field label="Telefone do responsável"><Input value={form.responsavel_telefone} onChange={e=>set('responsavel_telefone',e.target.value)}/></Field>
      <Field label="Observações" wide><Textarea value={form.observacoes} onChange={e=>set('observacoes',e.target.value)} rows="3"/></Field>
    </div><div className="form-footer">{msg&&<span className="form-msg">{msg}</span>}<Button type="submit" disabled={saving}><Save size={18}/>{saving?'Salvando...':'Salvar condomínio'}</Button></div></form>}
    {data.condos.length?<div className="record-grid">{data.condos.map(c=><article className="record-card" key={c.id}><div className="record-icon"><Building2 size={22}/></div><div><strong>{c.nome}</strong><span><MapPin size={14}/>{[c.cidade,c.estado].filter(Boolean).join(' / ')||'Endereço não informado'}</span><small>{c.quantidade_unidades||0} unidades · {c.tipo}</small></div></article>)}</div>:!showForm&&<Empty icon={Building2} title="Nenhum condomínio cadastrado" text="Crie o primeiro condomínio para liberar unidades, moradores, reservas e cobranças." action="Cadastrar condomínio" onClick={()=>setShowForm(true)}/>} 
  </section>
}

function MoradoresPage({data}){
  const[showForm,setShowForm]=useState(data.units.length===0);
  const[msg,setMsg]=useState('');
  const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({condominio_id:'',bloco:'',identificacao:'',tipo:'apartamento',morador_nome:'',vinculo:'proprietario',morador_email:'',morador_telefone:'',reside:true,veiculo_placa:'',veiculo_modelo:'',pet_nome:'',pet_especie:'cachorro'});
  useEffect(()=>{if(!form.condominio_id&&data.condos[0])setForm(s=>({...s,condominio_id:data.condos[0].id}))},[data.condos,form.condominio_id]);
  const set=(k,v)=>setForm(s=>({...s,[k]:v}));
  const personById=useMemo(()=>Object.fromEntries(data.people.map(p=>[p.id,p])),[data.people]);
  const linksByUnit=useMemo(()=>{const m={};for(const l of data.links)(m[l.unidade_id]||(m[l.unidade_id]=[])).push(l);return m},[data.links]);
  async function save(e){
    e.preventDefault();setSaving(true);setMsg('');
    try{
      const condo=data.condos.find(c=>c.id===form.condominio_id);if(!condo)throw new Error('Selecione um condomínio.');
      let blockId=null;
      if(form.bloco.trim()){
        const existing=data.blocks.find(b=>b.condominio_id===condo.id&&b.nome.toLowerCase()===form.bloco.trim().toLowerCase());
        if(existing)blockId=existing.id;
        else{
          const{data:block,error}=await supabase.from('blocos').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,nome:form.bloco.trim()}).select().single();
          if(error)throw error;blockId=block.id;
        }
      }
      const{data:unit,error:unitErr}=await supabase.from('unidades').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,bloco_id:blockId,identificacao:form.identificacao.trim(),tipo:form.tipo}).select().single();
      if(unitErr)throw unitErr;
      let person=null;
      if(form.morador_nome.trim()){
        const{data:p,error}=await supabase.from('pessoas').insert({empresa_id:condo.empresa_id,nome:form.morador_nome.trim(),email:form.morador_email||null,telefone:form.morador_telefone||null}).select().single();
        if(error)throw error;person=p;
        const{error:linkErr}=await supabase.from('unidade_pessoas').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,unidade_id:unit.id,pessoa_id:p.id,vinculo:form.vinculo,principal:true,reside:form.reside});
        if(linkErr)throw linkErr;
      }
      if(form.veiculo_placa.trim()){
        const{error}=await supabase.from('veiculos').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,unidade_id:unit.id,pessoa_id:person?.id||null,placa:form.veiculo_placa.trim().toUpperCase(),modelo:form.veiculo_modelo||null});
        if(error)throw error;
      }
      if(form.pet_nome.trim()){
        const{error}=await supabase.from('pets').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,unidade_id:unit.id,nome:form.pet_nome.trim(),especie:form.pet_especie});
        if(error)throw error;
      }
      setMsg('Unidade e morador cadastrados com sucesso.');
      setForm(s=>({...s,bloco:'',identificacao:'',morador_nome:'',morador_email:'',morador_telefone:'',veiculo_placa:'',veiculo_modelo:'',pet_nome:''}));
      await data.refresh();setShowForm(false);
    }catch(err){setMsg(err.message||'Não foi possível salvar.')}finally{setSaving(false)}
  }
  return <section className="module-page">
    <PageHead icon={Users} title="Unidades e moradores" description="Organize bloco, apartamento, proprietário, inquilino, moradores, veículo e pet." action="Adicionar unidade" onAction={()=>setShowForm(v=>!v)}/>
    {!data.condos.length?<Empty icon={Building2} title="Cadastre um condomínio primeiro" text="A unidade precisa pertencer a um condomínio."/>:showForm&&<form className="data-form panel" onSubmit={save}><div className="form-title"><div><span>CADASTRO</span><h3>Unidade e morador</h3></div></div><div className="form-grid">
      <Field label="Condomínio"><Select value={form.condominio_id} onChange={e=>set('condominio_id',e.target.value)} required>{data.condos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</Select></Field>
      <Field label="Bloco / torre"><Input value={form.bloco} onChange={e=>set('bloco',e.target.value)} placeholder="Ex.: Bloco A"/></Field>
      <Field label="Apartamento / unidade"><Input value={form.identificacao} onChange={e=>set('identificacao',e.target.value)} required placeholder="Ex.: 301"/></Field>
      <Field label="Tipo de unidade"><Select value={form.tipo} onChange={e=>set('tipo',e.target.value)}><option value="apartamento">Apartamento</option><option value="casa">Casa</option><option value="loja">Loja</option><option value="sala">Sala</option></Select></Field>
      <div className="form-divider wide"><span>MORADOR / RESPONSÁVEL DA UNIDADE</span></div>
      <Field label="Nome completo"><Input value={form.morador_nome} onChange={e=>set('morador_nome',e.target.value)} placeholder="Nome do morador"/></Field>
      <Field label="Vínculo"><Select value={form.vinculo} onChange={e=>set('vinculo',e.target.value)}><option value="proprietario">Proprietário</option><option value="inquilino">Inquilino</option><option value="morador">Morador</option><option value="dependente">Dependente</option></Select></Field>
      <Field label="E-mail"><Input type="email" value={form.morador_email} onChange={e=>set('morador_email',e.target.value)}/></Field>
      <Field label="Telefone"><Input value={form.morador_telefone} onChange={e=>set('morador_telefone',e.target.value)}/></Field>
      <Field label="Reside na unidade?"><Select value={form.reside?'sim':'nao'} onChange={e=>set('reside',e.target.value==='sim')}><option value="sim">Sim</option><option value="nao">Não</option></Select></Field>
      <div className="form-divider wide"><span>INFORMAÇÕES OPCIONAIS</span></div>
      <Field label="Placa do veículo"><Input value={form.veiculo_placa} onChange={e=>set('veiculo_placa',e.target.value)} placeholder="ABC1D23"/></Field>
      <Field label="Modelo do veículo"><Input value={form.veiculo_modelo} onChange={e=>set('veiculo_modelo',e.target.value)}/></Field>
      <Field label="Nome do pet"><Input value={form.pet_nome} onChange={e=>set('pet_nome',e.target.value)}/></Field>
      <Field label="Espécie"><Select value={form.pet_especie} onChange={e=>set('pet_especie',e.target.value)}><option value="cachorro">Cachorro</option><option value="gato">Gato</option><option value="ave">Ave</option><option value="outro">Outro</option></Select></Field>
    </div><div className="form-footer">{msg&&<span className="form-msg">{msg}</span>}<Button type="submit" disabled={saving}><Save size={18}/>{saving?'Salvando...':'Salvar unidade'}</Button></div></form>}
    {data.units.length?<div className="record-grid">{data.units.map(u=>{const condo=data.condos.find(c=>c.id===u.condominio_id);const block=data.blocks.find(b=>b.id===u.bloco_id);const names=(linksByUnit[u.id]||[]).map(l=>personById[l.pessoa_id]?.nome).filter(Boolean);return <article className="record-card" key={u.id}><div className="record-icon"><Home size={22}/></div><div><strong>{block?`${block.nome} · `:''}{u.identificacao}</strong><span><Building2 size={14}/>{condo?.nome||'Condomínio'}</span><small>{names.length?names.join(', '):'Sem morador vinculado'}</small></div></article>})}</div>:!showForm&&data.condos.length>0&&<Empty icon={Home} title="Nenhuma unidade cadastrada" text="Adicione apartamentos ou unidades e vincule os moradores." action="Adicionar unidade" onClick={()=>setShowForm(true)}/>} 
  </section>
}

function OperationalPage({id,data}){
  if(id==='reservas')return <ReservasPage data={data}/>;
  const cfg={
    financeiro:{icon:Wallet,action:'Lançar movimentação',table:'movimentacoes_financeiras'},
    cobrancas:{icon:CreditCard,action:'Criar cobrança',table:'cobrancas'},
    comunicados:{icon:MessageSquare,action:'Novo comunicado',table:'comunicados'},
    ocorrencias:{icon:TriangleAlert,action:'Nova ocorrência',table:'chamados'},
    documentos:{icon:FileText,action:'Adicionar documento',table:'documentos'},
  }[id];
  const records={financeiro:data.finance,cobrancas:data.charges,comunicados:data.notices,ocorrencias:data.issues,documentos:data.docs}[id]||[];
  return <SimpleOperational id={id} cfg={cfg} copy={moduleCopy[id]} records={records} data={data}/>;
}

function SimpleOperational({id,cfg,copy,records,data}){
  const[showForm,setShowForm]=useState(false);
  const[msg,setMsg]=useState('');
  const[saving,setSaving]=useState(false);
  const base={condominio_id:'',descricao:'',titulo:'',categoria:'geral',tipo:'receita',valor:'',competencia:'',vencimento:'',status:'pendente',mensagem:'',prioridade:'normal',arquivo_url:'',observacoes:'',unidade_id:''};
  const[form,setForm]=useState(base);
  useEffect(()=>{if(!form.condominio_id&&data.condos[0])setForm(s=>({...s,condominio_id:data.condos[0].id}))},[data.condos,form.condominio_id]);
  const set=(k,v)=>setForm(s=>({...s,[k]:v}));
  async function save(e){
    e.preventDefault();setSaving(true);setMsg('');
    try{
      const condo=data.condos.find(c=>c.id===form.condominio_id);if(!condo)throw new Error('Selecione um condomínio.');
      let payload={empresa_id:condo.empresa_id,condominio_id:condo.id};
      if(id==='financeiro')payload={...payload,tipo:form.tipo,categoria:form.categoria,descricao:form.descricao,valor:Number(form.valor),competencia:form.competencia||null,vencimento:form.vencimento||null,status:form.status,observacoes:form.observacoes||null};
      if(id==='cobrancas')payload={...payload,unidade_id:form.unidade_id||null,descricao:form.descricao,vencimento:form.vencimento,valor:Number(form.valor),status:'aberta',observacoes:form.observacoes||null};
      if(id==='comunicados')payload={...payload,titulo:form.titulo,mensagem:form.mensagem,prioridade:form.prioridade,publicado:true,publicado_em:new Date().toISOString()};
      if(id==='ocorrencias')payload={...payload,unidade_id:form.unidade_id||null,titulo:form.titulo,descricao:form.descricao,categoria:form.categoria,prioridade:form.prioridade,status:'aberto'};
      if(id==='documentos')payload={...payload,titulo:form.titulo,categoria:form.categoria,arquivo_url:form.arquivo_url||null,observacoes:form.observacoes||null};
      const{error}=await supabase.from(cfg.table).insert(payload);
      if(error)throw error;
      setMsg('Registro salvo com sucesso.');setForm({...base,condominio_id:condo.id});await data.refresh();setShowForm(false);
    }catch(err){setMsg(err.message||'Não foi possível salvar.')}finally{setSaving(false)}
  }
  const condoUnits=data.units.filter(u=>u.condominio_id===form.condominio_id);
  return <section className="module-page">
    <PageHead icon={cfg.icon} title={copy[0]} description={copy[1]} action={cfg.action} onAction={()=>setShowForm(v=>!v)}/>
    {!data.condos.length?<Empty icon={Building2} title="Cadastre um condomínio primeiro" text="Este módulo depende de um condomínio ativo."/>:showForm&&<form className="data-form panel" onSubmit={save}><div className="form-title"><div><span>NOVO REGISTRO</span><h3>{cfg.action}</h3></div></div><div className="form-grid">
      <Field label="Condomínio"><Select value={form.condominio_id} onChange={e=>set('condominio_id',e.target.value)} required>{data.condos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</Select></Field>
      {(id==='cobrancas'||id==='ocorrencias')&&<Field label="Unidade"><Select value={form.unidade_id} onChange={e=>set('unidade_id',e.target.value)}><option value="">Geral / sem unidade</option>{condoUnits.map(u=><option key={u.id} value={u.id}>{u.identificacao}</option>)}</Select></Field>}
      {id==='financeiro'&&<><Field label="Tipo"><Select value={form.tipo} onChange={e=>set('tipo',e.target.value)}><option value="receita">Receita</option><option value="despesa">Despesa</option></Select></Field><Field label="Categoria"><Input value={form.categoria} onChange={e=>set('categoria',e.target.value)} required/></Field><Field label="Descrição" wide><Input value={form.descricao} onChange={e=>set('descricao',e.target.value)} required/></Field><Field label="Valor"><Input type="number" step="0.01" min="0" value={form.valor} onChange={e=>set('valor',e.target.value)} required/></Field><Field label="Competência"><Input type="date" value={form.competencia} onChange={e=>set('competencia',e.target.value)}/></Field><Field label="Vencimento"><Input type="date" value={form.vencimento} onChange={e=>set('vencimento',e.target.value)}/></Field><Field label="Status"><Select value={form.status} onChange={e=>set('status',e.target.value)}><option value="pendente">Pendente</option><option value="pago">Pago</option></Select></Field></>}
      {id==='cobrancas'&&<><Field label="Descrição" wide><Input value={form.descricao} onChange={e=>set('descricao',e.target.value)} required/></Field><Field label="Vencimento"><Input type="date" value={form.vencimento} onChange={e=>set('vencimento',e.target.value)} required/></Field><Field label="Valor"><Input type="number" step="0.01" min="0" value={form.valor} onChange={e=>set('valor',e.target.value)} required/></Field></>}
      {id==='comunicados'&&<><Field label="Título" wide><Input value={form.titulo} onChange={e=>set('titulo',e.target.value)} required/></Field><Field label="Prioridade"><Select value={form.prioridade} onChange={e=>set('prioridade',e.target.value)}><option value="normal">Normal</option><option value="alta">Alta</option><option value="urgente">Urgente</option></Select></Field><Field label="Mensagem" wide><Textarea rows="5" value={form.mensagem} onChange={e=>set('mensagem',e.target.value)} required/></Field></>}
      {id==='ocorrencias'&&<><Field label="Título" wide><Input value={form.titulo} onChange={e=>set('titulo',e.target.value)} required/></Field><Field label="Categoria"><Input value={form.categoria} onChange={e=>set('categoria',e.target.value)} required/></Field><Field label="Prioridade"><Select value={form.prioridade} onChange={e=>set('prioridade',e.target.value)}><option value="baixa">Baixa</option><option value="normal">Normal</option><option value="alta">Alta</option><option value="urgente">Urgente</option></Select></Field><Field label="Descrição" wide><Textarea rows="5" value={form.descricao} onChange={e=>set('descricao',e.target.value)} required/></Field></>}
      {id==='documentos'&&<><Field label="Título" wide><Input value={form.titulo} onChange={e=>set('titulo',e.target.value)} required/></Field><Field label="Categoria"><Input value={form.categoria} onChange={e=>set('categoria',e.target.value)} required/></Field><Field label="Link do arquivo"><Input value={form.arquivo_url} onChange={e=>set('arquivo_url',e.target.value)} placeholder="https://..."/></Field></>}
      {(id==='financeiro'||id==='cobrancas'||id==='documentos')&&<Field label="Observações" wide><Textarea rows="3" value={form.observacoes} onChange={e=>set('observacoes',e.target.value)}/></Field>}
    </div><div className="form-footer">{msg&&<span className="form-msg">{msg}</span>}<Button type="submit" disabled={saving}><Save size={18}/>{saving?'Salvando...':'Salvar'}</Button></div></form>}
    {records.length?<div className="record-list">{records.map(r=><article className="list-row" key={r.id}><div className="record-icon"><cfg.icon size={20}/></div><div className="grow"><strong>{r.titulo||r.descricao||r.categoria||'Registro'}</strong><span>{data.condos.find(c=>c.id===r.condominio_id)?.nome||'Condomínio'}</span></div>{r.valor!=null&&<b>{Number(r.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</b>}<small className="pill">{r.status||r.prioridade||r.categoria}</small></article>)}</div>:!showForm&&data.condos.length>0&&<Empty icon={cfg.icon} title="Nenhum registro ainda" text={copy[1]} action={cfg.action} onClick={()=>setShowForm(true)}/>} 
  </section>
}

function ReservasPage({data}){
  const[showForm,setShowForm]=useState(false);
  const[msg,setMsg]=useState('');
  const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({condominio_id:'',area_nome:'',unidade_id:'',responsavel_nome:'',inicio_em:'',fim_em:'',observacoes:''});
  useEffect(()=>{if(!form.condominio_id&&data.condos[0])setForm(s=>({...s,condominio_id:data.condos[0].id}))},[data.condos,form.condominio_id]);
  const set=(k,v)=>setForm(s=>({...s,[k]:v}));
  async function save(e){
    e.preventDefault();setSaving(true);setMsg('');
    try{
      const condo=data.condos.find(c=>c.id===form.condominio_id);if(!condo)throw new Error('Selecione um condomínio.');
      let area=data.areas.find(a=>a.condominio_id===condo.id&&a.nome.toLowerCase()===form.area_nome.trim().toLowerCase());
      if(!area){
        const{data:a,error}=await supabase.from('areas_comuns').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,nome:form.area_nome.trim()}).select().single();
        if(error)throw error;area=a;
      }
      let pessoaId=null;
      if(form.responsavel_nome.trim()){
        const{data:p,error}=await supabase.from('pessoas').insert({empresa_id:condo.empresa_id,nome:form.responsavel_nome.trim()}).select().single();
        if(error)throw error;pessoaId=p.id;
      }
      const{error}=await supabase.from('reservas').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,area_comum_id:area.id,unidade_id:form.unidade_id||null,pessoa_id:pessoaId,inicio_em:new Date(form.inicio_em).toISOString(),fim_em:new Date(form.fim_em).toISOString(),status:'pendente',observacoes:form.observacoes||null});
      if(error)throw error;
      setMsg('Reserva cadastrada com sucesso.');setForm(s=>({...s,area_nome:'',unidade_id:'',responsavel_nome:'',inicio_em:'',fim_em:'',observacoes:''}));await data.refresh();setShowForm(false);
    }catch(err){setMsg(err.message||'Não foi possível salvar.')}finally{setSaving(false)}
  }
  const condoUnits=data.units.filter(u=>u.condominio_id===form.condominio_id);
  return <section className="module-page">
    <PageHead icon={CalendarDays} title="Reservas" description="Cadastre a área comum e vincule a reserva à unidade ou responsável." action="Nova reserva" onAction={()=>setShowForm(v=>!v)}/>
    {!data.condos.length?<Empty icon={Building2} title="Cadastre um condomínio primeiro" text="As reservas precisam estar vinculadas a um condomínio."/>:showForm&&<form className="data-form panel" onSubmit={save}><div className="form-title"><div><span>RESERVA</span><h3>Nova reserva</h3></div></div><div className="form-grid">
      <Field label="Condomínio"><Select value={form.condominio_id} onChange={e=>set('condominio_id',e.target.value)} required>{data.condos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</Select></Field>
      <Field label="Área comum"><Input value={form.area_nome} onChange={e=>set('area_nome',e.target.value)} required placeholder="Ex.: Salão de festas"/></Field>
      <Field label="Unidade"><Select value={form.unidade_id} onChange={e=>set('unidade_id',e.target.value)}><option value="">Sem unidade</option>{condoUnits.map(u=><option key={u.id} value={u.id}>{u.identificacao}</option>)}</Select></Field>
      <Field label="Responsável pela reserva"><Input value={form.responsavel_nome} onChange={e=>set('responsavel_nome',e.target.value)} placeholder="Nome completo"/></Field>
      <Field label="Início"><Input type="datetime-local" value={form.inicio_em} onChange={e=>set('inicio_em',e.target.value)} required/></Field>
      <Field label="Fim"><Input type="datetime-local" value={form.fim_em} onChange={e=>set('fim_em',e.target.value)} required/></Field>
      <Field label="Observações" wide><Textarea rows="3" value={form.observacoes} onChange={e=>set('observacoes',e.target.value)}/></Field>
    </div><div className="form-footer">{msg&&<span className="form-msg">{msg}</span>}<Button type="submit" disabled={saving}><Save size={18}/>{saving?'Salvando...':'Salvar reserva'}</Button></div></form>}
    {data.reservations.length?<div className="record-list">{data.reservations.map(r=>{const area=data.areas.find(a=>a.id===r.area_comum_id);const unit=data.units.find(u=>u.id===r.unidade_id);return <article className="list-row" key={r.id}><div className="record-icon"><CalendarDays size={20}/></div><div className="grow"><strong>{area?.nome||'Área comum'}{unit?` · Unidade ${unit.identificacao}`:''}</strong><span>{new Date(r.inicio_em).toLocaleString('pt-BR')} até {new Date(r.fim_em).toLocaleString('pt-BR')}</span></div><small className="pill">{r.status}</small></article>})}</div>:!showForm&&data.condos.length>0&&<Empty icon={CalendarDays} title="Nenhuma reserva ainda" text="Cadastre salão, churrasqueira ou outra área no momento da primeira reserva." action="Nova reserva" onClick={()=>setShowForm(true)}/>} 
  </section>
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
    e.preventDefault();if(!supabase){setMsg('Configuração do banco não encontrada.');return}
    setBusy(true);setMsg('');
    if(mode==='login'){const{error}=await supabase.auth.signInWithPassword({email,password});setMsg(error?'Não foi possível entrar. Verifique o e-mail e a senha.':'')}
    else if(mode==='signup'){const{error}=await supabase.auth.signUp({email,password,options:{data:{nome:name,telefone:phone,condominio}}});setMsg(error?error.message:'Cadastro enviado. Confira seu e-mail para confirmar a conta.')}
    else{const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});setMsg(error?error.message:'Link de recuperação enviado. Confira seu e-mail.')}
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
