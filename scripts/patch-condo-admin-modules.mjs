import fs from 'node:fs';

const marker='PEM_CONDO_ADMIN_MODULES';

export function patchSource(input){
  let source=input;

  if(!source.includes("id:'cadastros'")){
    source=source.replace(
      "  {id:'reservas',label:'Reservas',icon:CalendarDays},\n];",
      "  {id:'reservas',label:'Reservas',icon:CalendarDays},\n  {id:'cadastros',label:'Cadastros',icon:UserPlus},\n  {id:'manutencao',label:'Manutenção',icon:TriangleAlert},\n  {id:'configuracoes',label:'Configurações',icon:KeyRound},\n];"
    );
  }

  if(!source.includes("active==='cadastros'")){
    source=source.replace(
      "</>:active==='condominios'?<CondominiosPage data={data}/>:active==='moradores'?<MoradoresPage data={data}/>:<OperationalPage id={active} data={data}/>} ",
      "</>:active==='condominios'?<CondominiosPage data={data}/>:active==='moradores'?<MoradoresPage data={data}/>:active==='cadastros'?<CadastrosPage data={data}/>:active==='manutencao'?<ManutencaoPage data={data}/>:active==='configuracoes'?<ConfiguracoesPage data={data}/>:<OperationalPage id={active} data={data}/>} "
    );
  }

  if(!source.includes(marker)){
    const anchor='function OperationalPage({id,data}){';
    const components=`/* ${marker} */
function ConfiguracoesPage({data}){
  const[selectedId,setSelectedId]=useState('');
  const[saving,setSaving]=useState(false);
  const[msg,setMsg]=useState('');
  const[form,setForm]=useState({nome:'',razao_social:'',cnpj:'',email:'',telefone:'',cep:'',logradouro:'',numero:'',bairro:'',cidade:'',estado:'PE'});
  const set=(k,v)=>setForm(s=>({...s,[k]:v}));
  useEffect(()=>{
    const fallback=data.condos[0]?.id||'';
    if(!selectedId&&fallback){setSelectedId(fallback);return}
    const condo=data.condos.find(c=>c.id===selectedId);
    if(condo)setForm({nome:condo.nome||'',razao_social:condo.razao_social||'',cnpj:condo.cnpj||'',email:condo.email||'',telefone:condo.telefone||'',cep:condo.cep||'',logradouro:condo.logradouro||'',numero:condo.numero||'',bairro:condo.bairro||'',cidade:condo.cidade||'',estado:condo.estado||'PE'});
  },[data.condos,selectedId]);
  async function save(e){
    e.preventDefault();if(!selectedId)return;setSaving(true);setMsg('');
    try{
      const payload={...form,nome:form.nome.trim(),razao_social:form.razao_social||null,cnpj:form.cnpj||null,email:form.email||null,telefone:form.telefone||null,cep:form.cep||null,logradouro:form.logradouro||null,numero:form.numero||null,bairro:form.bairro||null,cidade:form.cidade.trim(),estado:form.estado.trim().toUpperCase()};
      const{error}=await supabase.from('condominios').update(payload).eq('id',selectedId);
      if(error)throw error;
      setMsg('Configurações salvas com sucesso.');await data.refresh();
    }catch(err){setMsg(err.message||'Não foi possível salvar as configurações.')}finally{setSaving(false)}
  }
  if(!data.condos.length)return <section className="module-page"><PageHead icon={KeyRound} title="Configurações" description="Dados cadastrais e identificação do condomínio."/><Empty icon={Building2} title="Cadastre um condomínio primeiro" text="As configurações ficam vinculadas ao condomínio cadastrado."/></section>;
  return <section className="module-page"><PageHead icon={KeyRound} title="Configurações" description="Edite os dados oficiais usados pela administração."/><form className="data-form panel" onSubmit={save}><div className="form-title"><div><span>DADOS CADASTRAIS</span><h3>Configurações do condomínio</h3></div></div><div className="form-grid">
    {data.condos.length>1&&<Field label="Condomínio"><Select value={selectedId} onChange={e=>setSelectedId(e.target.value)}>{data.condos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</Select></Field>}
    <Field label="Nome"><Input value={form.nome} onChange={e=>set('nome',e.target.value)} required/></Field><Field label="Razão social"><Input value={form.razao_social} onChange={e=>set('razao_social',e.target.value)}/></Field><Field label="CNPJ"><Input value={form.cnpj} onChange={e=>set('cnpj',e.target.value)} placeholder="00.000.000/0001-00"/></Field><Field label="E-mail"><Input type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></Field><Field label="Telefone"><Input value={form.telefone} onChange={e=>set('telefone',e.target.value)}/></Field><Field label="CEP"><Input value={form.cep} onChange={e=>set('cep',e.target.value)}/></Field><Field label="Logradouro"><Input value={form.logradouro} onChange={e=>set('logradouro',e.target.value)}/></Field><Field label="Número"><Input value={form.numero} onChange={e=>set('numero',e.target.value)}/></Field><Field label="Bairro"><Input value={form.bairro} onChange={e=>set('bairro',e.target.value)}/></Field><Field label="Cidade"><Input value={form.cidade} onChange={e=>set('cidade',e.target.value)} required/></Field><Field label="Estado"><Input value={form.estado} maxLength={2} onChange={e=>set('estado',e.target.value)} required/></Field>
  </div><div className="form-footer">{msg&&<span className="form-msg">{msg}</span>}<Button type="submit" disabled={saving}><Save size={18}/>{saving?'Salvando...':'Salvar configurações'}</Button></div></form></section>;
}

function CadastrosPage({data}){
  const[items,setItems]=useState([]);const[loading,setLoading]=useState(false);const[showForm,setShowForm]=useState(false);const[msg,setMsg]=useState('');
  const[form,setForm]=useState({condominio_id:'',categoria:'Fornecedor',nome:'',razao_social:'',cnpj:'',responsavel:'',email:'',telefone:'',whatsapp:'',cidade:'',estado:'PE',observacoes:''});
  const empresaId=data.condos[0]?.empresa_id||'';const set=(k,v)=>setForm(s=>({...s,[k]:v}));
  const load=useCallback(async()=>{if(!empresaId){setItems([]);return}setLoading(true);const{data:rows,error}=await supabase.from('prestadores_servicos').select('*').eq('empresa_id',empresaId).order('nome');if(!error)setItems(rows||[]);setLoading(false)},[empresaId]);
  useEffect(()=>{load()},[load]);
  useEffect(()=>{if(!form.condominio_id&&data.condos[0]?.id)set('condominio_id',data.condos[0].id)},[data.condos,form.condominio_id]);
  async function save(e){e.preventDefault();if(!empresaId)return;setMsg('');try{const payload={empresa_id:empresaId,condominio_id:form.condominio_id||null,nome:form.nome.trim(),razao_social:form.razao_social||null,cnpj:form.cnpj||null,categoria:form.categoria,responsavel:form.responsavel||null,email:form.email||null,telefone:form.telefone||null,whatsapp:form.whatsapp||null,cidade:form.cidade||null,estado:form.estado||null,observacoes:form.observacoes||null};const{error}=await supabase.from('prestadores_servicos').insert(payload);if(error)throw error;setMsg('Cadastro salvo com sucesso.');setForm(s=>({...s,nome:'',razao_social:'',cnpj:'',responsavel:'',email:'',telefone:'',whatsapp:'',cidade:'',observacoes:''}));await load();setShowForm(false)}catch(err){setMsg(err.message||'Não foi possível salvar o cadastro.')}}
  if(!data.condos.length)return <section className="module-page"><PageHead icon={UserPlus} title="Cadastros" description="Empresas e fornecedores do condomínio."/><Empty icon={Building2} title="Cadastre um condomínio primeiro" text="Fornecedores precisam ficar vinculados a uma administração."/></section>;
  return <section className="module-page"><PageHead icon={UserPlus} title="Empresas e fornecedores" description="Centralize prestadores, empresas de manutenção e fornecedores recorrentes." action="Novo cadastro" onAction={()=>setShowForm(v=>!v)}/>{showForm&&<form className="data-form panel" onSubmit={save}><div className="form-title"><div><span>CADASTRO</span><h3>Empresa ou fornecedor</h3></div></div><div className="form-grid"><Field label="Condomínio"><Select value={form.condominio_id} onChange={e=>set('condominio_id',e.target.value)}>{data.condos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</Select></Field><Field label="Categoria"><Select value={form.categoria} onChange={e=>set('categoria',e.target.value)}><option>Fornecedor</option><option>Empresa de manutenção</option><option>Limpeza</option><option>Segurança</option><option>Elevadores</option><option>Elétrica</option><option>Hidráulica</option><option>Contabilidade</option><option>Outros</option></Select></Field><Field label="Nome"><Input value={form.nome} onChange={e=>set('nome',e.target.value)} required/></Field><Field label="Razão social"><Input value={form.razao_social} onChange={e=>set('razao_social',e.target.value)}/></Field><Field label="CNPJ"><Input value={form.cnpj} onChange={e=>set('cnpj',e.target.value)}/></Field><Field label="Responsável"><Input value={form.responsavel} onChange={e=>set('responsavel',e.target.value)}/></Field><Field label="E-mail"><Input type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></Field><Field label="Telefone"><Input value={form.telefone} onChange={e=>set('telefone',e.target.value)}/></Field><Field label="WhatsApp"><Input value={form.whatsapp} onChange={e=>set('whatsapp',e.target.value)}/></Field><Field label="Cidade"><Input value={form.cidade} onChange={e=>set('cidade',e.target.value)}/></Field><Field label="Estado"><Input maxLength={2} value={form.estado} onChange={e=>set('estado',e.target.value)}/></Field><Field label="Observações" wide><Textarea value={form.observacoes} onChange={e=>set('observacoes',e.target.value)}/></Field></div><div className="form-footer">{msg&&<span className="form-msg">{msg}</span>}<Button type="submit"><Save size={18}/>Salvar cadastro</Button></div></form>}{loading?<div className="panel">Carregando cadastros...</div>:items.length?<div className="record-grid">{items.map(item=><article className="record-card" key={item.id}><div className="record-icon"><Building2 size={22}/></div><div><strong>{item.nome}</strong><span>{item.categoria||'Fornecedor'}</span><small>{[item.cnpj,item.telefone||item.whatsapp].filter(Boolean).join(' · ')||'Sem contato informado'}</small></div></article>)}</div>:!showForm&&<Empty icon={UserPlus} title="Nenhuma empresa ou fornecedor cadastrado" text="Cadastre prestadores e fornecedores usados pelo condomínio." action="Novo cadastro" onClick={()=>setShowForm(true)}/>}</section>;
}

function ManutencaoPage({data}){
  const[showForm,setShowForm]=useState(false);const[msg,setMsg]=useState('');const[form,setForm]=useState({condominio_id:'',tipo:'corretiva',titulo:'',descricao:'',prioridade:'normal'});const set=(k,v)=>setForm(s=>({...s,[k]:v}));
  useEffect(()=>{if(!form.condominio_id&&data.condos[0]?.id)set('condominio_id',data.condos[0].id)},[data.condos,form.condominio_id]);
  const rows=data.issues.filter(x=>String(x.categoria||'').toLowerCase().includes('manuten'));
  async function save(e){e.preventDefault();const condo=data.condos.find(c=>c.id===form.condominio_id);if(!condo)return;setMsg('');try{const{error}=await supabase.from('chamados').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,titulo:form.titulo.trim(),descricao:form.descricao.trim(),categoria:form.tipo==='preventiva'?'Manutenção preventiva':'Manutenção corretiva',prioridade:form.prioridade,status:'aberto'});if(error)throw error;setMsg('Manutenção registrada com sucesso.');setForm(s=>({...s,titulo:'',descricao:''}));await data.refresh();setShowForm(false)}catch(err){setMsg(err.message||'Não foi possível registrar a manutenção.')}}
  return <section className="module-page"><PageHead icon={TriangleAlert} title="Manutenção" description="Manutenção preventiva e corretiva, com prioridade e acompanhamento por condomínio." action="Registrar manutenção" onAction={()=>setShowForm(v=>!v)}/>{showForm&&<form className="data-form panel" onSubmit={save}><div className="form-title"><div><span>MANUTENÇÃO</span><h3>Novo registro</h3></div></div><div className="form-grid"><Field label="Condomínio"><Select value={form.condominio_id} onChange={e=>set('condominio_id',e.target.value)}>{data.condos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</Select></Field><Field label="Tipo"><Select value={form.tipo} onChange={e=>set('tipo',e.target.value)}><option value="corretiva">Corretiva</option><option value="preventiva">Preventiva</option></Select></Field><Field label="Prioridade"><Select value={form.prioridade} onChange={e=>set('prioridade',e.target.value)}><option value="baixa">Baixa</option><option value="normal">Normal</option><option value="alta">Alta</option><option value="urgente">Urgente</option></Select></Field><Field label="Título"><Input value={form.titulo} onChange={e=>set('titulo',e.target.value)} required/></Field><Field label="Descrição" wide><Textarea value={form.descricao} onChange={e=>set('descricao',e.target.value)} required/></Field></div><div className="form-footer">{msg&&<span className="form-msg">{msg}</span>}<Button type="submit"><Save size={18}/>Salvar manutenção</Button></div></form>}{rows.length?<div className="record-grid">{rows.map(item=><article className="record-card" key={item.id}><div className="record-icon"><TriangleAlert size={22}/></div><div><strong>{item.titulo}</strong><span>{item.categoria} · {item.status}</span><small>Prioridade: {item.prioridade||'normal'}</small></div></article>)}</div>:!showForm&&<Empty icon={TriangleAlert} title="Nenhuma manutenção registrada" text="Registre demandas preventivas ou corretivas para acompanhar pela administração." action="Registrar manutenção" onClick={()=>setShowForm(true)}/>}</section>;
}

`;
    source=source.replace(anchor,components+anchor);
  }

  return source;
}

if(process.argv[1]?.endsWith('patch-condo-admin-modules.mjs')){
  const file='src/main.jsx';
  const current=fs.readFileSync(file,'utf8');
  const patched=patchSource(current);
  if(patched===current){console.log('PEM Condomínios: módulos administrativos já aplicados');process.exit(0)}
  fs.writeFileSync(file,patched);
  console.log('PEM Condomínios: configurações, cadastros e manutenção aplicados');
}
