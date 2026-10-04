import fs from 'node:fs';

const file='src/main.jsx';
let source=fs.readFileSync(file,'utf8');

if(source.includes('PEM_CONFIGURACOES_CADASTROS')){
  console.log('PEM Condomínios: configurações e cadastros já aplicados');
  process.exit(0);
}

source=source.replace(
  "import{Mail,Lock,ArrowRight,Eye,EyeOff,LogOut,LayoutDashboard,Building2,Users,Wallet,CreditCard,MessageSquare,TriangleAlert,FileText,CalendarDays,Menu,X,Plus,ChevronRight,KeyRound,UserPlus,Phone,Home,Save,Search,MapPin,Car,Dog,UserRound,RefreshCw}from'lucide-react';",
  "import{Mail,Lock,ArrowRight,Eye,EyeOff,LogOut,LayoutDashboard,Building2,Users,Wallet,CreditCard,MessageSquare,TriangleAlert,FileText,CalendarDays,Menu,X,Plus,ChevronRight,KeyRound,UserPlus,Phone,Home,Save,Search,MapPin,Car,Dog,UserRound,RefreshCw,Settings,BriefcaseBusiness,Wrench}from'lucide-react';"
);

source=source.replace(
  "  {id:'reservas',label:'Reservas',icon:CalendarDays},\n];",
  "  {id:'reservas',label:'Reservas',icon:CalendarDays},\n  {id:'cadastros',label:'Cadastros',icon:BriefcaseBusiness},\n  {id:'configuracoes',label:'Configurações',icon:Settings},\n];"
);

source=source.replace(
  "  const[docs,setDocs]=useState([]);",
  "  const[docs,setDocs]=useState([]);\n  const[providers,setProviders]=useState([]);"
);

source=source.replace(
  "      supabase.from('documentos').select('*').order('created_at',{ascending:false}).limit(100),\n    ];",
  "      supabase.from('documentos').select('*').order('created_at',{ascending:false}).limit(100),\n      supabase.from('prestadores_servicos').select('*').order('created_at',{ascending:false}).limit(100),\n    ];"
);

source=source.replace(
  "    const [c,b,u,p,l,a,r,f,ch,n,i,d]=results.map(r=>r.data||[]);\n    setCondos(c);setBlocks(b);setUnits(u);setPeople(p);setLinks(l);setAreas(a);setReservations(r);setFinance(f);setCharges(ch);setNotices(n);setIssues(i);setDocs(d);",
  "    const [c,b,u,p,l,a,r,f,ch,n,i,d,pr]=results.map(r=>r.data||[]);\n    setCondos(c);setBlocks(b);setUnits(u);setPeople(p);setLinks(l);setAreas(a);setReservations(r);setFinance(f);setCharges(ch);setNotices(n);setIssues(i);setDocs(d);setProviders(pr);"
);

source=source.replace(
  "  return{loading,error,condos,blocks,units,people,links,areas,reservations,finance,charges,notices,issues,docs,refresh};",
  "  return{loading,error,condos,blocks,units,people,links,areas,reservations,finance,charges,notices,issues,docs,providers,refresh};"
);

source=source.replace(
  "</>:active==='condominios'?<CondominiosPage data={data}/>:active==='moradores'?<MoradoresPage data={data}/>:<OperationalPage id={active} data={data}/>} ",
  "</>:active==='condominios'?<CondominiosPage data={data}/>:active==='moradores'?<MoradoresPage data={data}/>:active==='cadastros'?<CadastrosPage data={data}/>:active==='configuracoes'?<ConfiguracoesPage data={data}/>:<OperationalPage id={active} data={data}/>} "
);

const anchor='function PageHead({icon:Icon,title,description,action,onAction}){';
const idx=source.indexOf(anchor);
if(idx<0){
  console.error('PEM Condomínios: ponto de inserção de Configurações/Cadastros não encontrado');
  process.exit(1);
}

const feature=`/* PEM_CONFIGURACOES_CADASTROS */\nfunction ConfiguracoesPage({data}){\n  const condo=data.condos[0];\n  const[msg,setMsg]=useState('');\n  const[saving,setSaving]=useState(false);\n  const[form,setForm]=useState({nome:'',razao_social:'',cnpj:'',email:'',telefone:'',cep:'',logradouro:'',numero:'',bairro:'',cidade:'',estado:'PE',responsavel:''});\n  useEffect(()=>{if(condo)setForm({nome:condo.nome||'',razao_social:condo.razao_social||'',cnpj:condo.cnpj||'',email:condo.email||'',telefone:condo.telefone||'',cep:condo.cep||'',logradouro:condo.logradouro||'',numero:condo.numero||'',bairro:condo.bairro||'',cidade:condo.cidade||'',estado:condo.estado||'PE',responsavel:''})},[condo?.id]);\n  const set=(k,v)=>setForm(s=>({...s,[k]:v}));\n  async function save(e){e.preventDefault();if(!condo)return;setSaving(true);setMsg('');try{const payload={nome:form.nome.trim(),razao_social:form.razao_social||null,cnpj:form.cnpj||null,email:form.email||null,telefone:form.telefone||null,cep:form.cep||null,logradouro:form.logradouro||null,numero:form.numero||null,bairro:form.bairro||null,cidade:form.cidade.trim(),estado:form.estado.trim().toUpperCase()};const{error}=await supabase.from('condominios').update(payload).eq('id',condo.id);if(error)throw error;setMsg('Configurações salvas.');await data.refresh()}catch(err){setMsg(err.message||'Não foi possível salvar as configurações.')}finally{setSaving(false)}}\n  if(!condo)return <section className=\"module-page\"><PageHead icon={Settings} title=\"Configurações\" description=\"Cadastre primeiro um condomínio para editar seus dados.\"/></section>;\n  return <section className=\"module-page\"><PageHead icon={Settings} title=\"Configurações\" description=\"Dados oficiais e contato do condomínio.\"/><form className=\"data-form panel\" onSubmit={save}><div className=\"form-grid\"><Field label=\"Nome do condomínio\"><Input value={form.nome} onChange={e=>set('nome',e.target.value)} required/></Field><Field label=\"Razão social\"><Input value={form.razao_social} onChange={e=>set('razao_social',e.target.value)}/></Field><Field label=\"CNPJ\"><Input value={form.cnpj} onChange={e=>set('cnpj',e.target.value)} placeholder=\"00.000.000/0001-00\"/></Field><Field label=\"E-mail\"><Input type=\"email\" value={form.email} onChange={e=>set('email',e.target.value)}/></Field><Field label=\"Telefone\"><Input value={form.telefone} onChange={e=>set('telefone',e.target.value)}/></Field><Field label=\"CEP\"><Input value={form.cep} onChange={e=>set('cep',e.target.value)}/></Field><Field label=\"Logradouro\" wide><Input value={form.logradouro} onChange={e=>set('logradouro',e.target.value)}/></Field><Field label=\"Número\"><Input value={form.numero} onChange={e=>set('numero',e.target.value)}/></Field><Field label=\"Bairro\"><Input value={form.bairro} onChange={e=>set('bairro',e.target.value)}/></Field><Field label=\"Cidade\"><Input value={form.cidade} onChange={e=>set('cidade',e.target.value)} required/></Field><Field label=\"Estado\"><Input value={form.estado} maxLength={2} onChange={e=>set('estado',e.target.value)}/></Field></div><Button disabled={saving}><Save size={18}/>{saving?'Salvando...':'Salvar alterações'}</Button>{msg&&<p className=\"form-message\">{msg}</p>}</form></section>;\n}\n\nfunction CadastrosPage({data}){\n  const[tab,setTab]=useState('fornecedores');\n  const[msg,setMsg]=useState('');\n  const[saving,setSaving]=useState(false);\n  const[form,setForm]=useState({nome:'',razao_social:'',cnpj:'',categoria:'manutencao',responsavel:'',email:'',telefone:'',whatsapp:'',cidade:'',estado:'PE',observacoes:''});\n  const condo=data.condos[0];\n  const set=(k,v)=>setForm(s=>({...s,[k]:v}));\n  async function saveProvider(e){e.preventDefault();if(!condo)return;setSaving(true);setMsg('');try{const{error}=await supabase.from('prestadores_servicos').insert({empresa_id:condo.empresa_id,condominio_id:condo.id,nome:form.nome.trim(),razao_social:form.razao_social||null,cnpj:form.cnpj||null,categoria:form.categoria,responsavel:form.responsavel||null,email:form.email||null,telefone:form.telefone||null,whatsapp:form.whatsapp||null,cidade:form.cidade||null,estado:form.estado||null,observacoes:form.observacoes||null,ativo:true});if(error)throw error;setMsg('Fornecedor cadastrado.');setForm({nome:'',razao_social:'',cnpj:'',categoria:'manutencao',responsavel:'',email:'',telefone:'',whatsapp:'',cidade:'',estado:'PE',observacoes:''});await data.refresh()}catch(err){setMsg(err.message||'Não foi possível cadastrar.')}finally{setSaving(false)}}\n  return <section className=\"module-page\"><PageHead icon={BriefcaseBusiness} title=\"Cadastros\" description=\"Empresas, fornecedores e manutenção em um único lugar.\"/><div className=\"panel\"><div className=\"quick-grid\"><button onClick={()=>setTab('empresas')}><Building2 size={22}/><div><strong>Empresas</strong><span>Dados da empresa administradora e do condomínio</span></div></button><button onClick={()=>setTab('fornecedores')}><BriefcaseBusiness size={22}/><div><strong>Fornecedores</strong><span>Prestadores e empresas contratadas</span></div></button><button onClick={()=>setTab('manutencao')}><Wrench size={22}/><div><strong>Manutenção</strong><span>Prestadores de pintura, elétrica, hidráulica e outros</span></div></button></div></div>{tab==='empresas'?<div className=\"panel\"><h3>Empresas</h3><p>O cadastro oficial da administradora e do condomínio fica em Configurações, evitando duplicidade de CNPJ e dados.</p></div>:<><form className=\"data-form panel\" onSubmit={saveProvider}><div className=\"form-title\"><div><span>CADASTRO</span><h3>{tab==='manutencao'?'Novo prestador de manutenção':'Novo fornecedor'}</h3></div></div><div className=\"form-grid\"><Field label=\"Nome / Nome fantasia\"><Input value={form.nome} onChange={e=>set('nome',e.target.value)} required/></Field><Field label=\"Razão social\"><Input value={form.razao_social} onChange={e=>set('razao_social',e.target.value)}/></Field><Field label=\"CNPJ\"><Input value={form.cnpj} onChange={e=>set('cnpj',e.target.value)}/></Field><Field label=\"Categoria\"><Input value={tab==='manutencao'?'manutencao':form.categoria} onChange={e=>set('categoria',e.target.value)} disabled={tab==='manutencao'}/></Field><Field label=\"Responsável\"><Input value={form.responsavel} onChange={e=>set('responsavel',e.target.value)}/></Field><Field label=\"E-mail\"><Input type=\"email\" value={form.email} onChange={e=>set('email',e.target.value)}/></Field><Field label=\"Telefone\"><Input value={form.telefone} onChange={e=>set('telefone',e.target.value)}/></Field><Field label=\"WhatsApp\"><Input value={form.whatsapp} onChange={e=>set('whatsapp',e.target.value)}/></Field><Field label=\"Cidade\"><Input value={form.cidade} onChange={e=>set('cidade',e.target.value)}/></Field><Field label=\"Estado\"><Input value={form.estado} maxLength={2} onChange={e=>set('estado',e.target.value)}/></Field><Field label=\"Observações\" wide><Textarea value={form.observacoes} onChange={e=>set('observacoes',e.target.value)}/></Field></div><Button disabled={saving}><Save size={18}/>{saving?'Salvando...':'Salvar cadastro'}</Button>{msg&&<p className=\"form-message\">{msg}</p>}</form><div className=\"panel\"><div className=\"panel-title\"><div><span>CADASTRADOS</span><h3>{tab==='manutencao'?'Prestadores de manutenção':'Fornecedores'}</h3></div></div><div className=\"list-stack\">{data.providers.filter(p=>tab==='manutencao'?String(p.categoria||'').toLowerCase().includes('manuten'):true).map(p=><div key={p.id} className=\"list-row\"><div><strong>{p.nome}</strong><span>{p.categoria||'Fornecedor'} · {p.telefone||p.whatsapp||'Sem contato'}</span></div></div>)}{data.providers.length===0&&<p>Nenhum fornecedor cadastrado.</p>}</div></div></>}</section>;\n}\n\n`;

source=source.slice(0,idx)+feature+source.slice(idx);
fs.writeFileSync(file,source);
console.log('PEM Condomínios: configurações e cadastros aplicados');
