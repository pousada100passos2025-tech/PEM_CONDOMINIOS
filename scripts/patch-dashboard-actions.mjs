import fs from 'node:fs';

const file='src/main.jsx';
let source=fs.readFileSync(file,'utf8');

const mustReplace=(from,to,label)=>{
  if(source.includes(to)) return;
  if(!source.includes(from)){
    console.error(`PEM Condomínios: não foi possível aplicar ${label}`);
    process.exit(1);
  }
  source=source.replace(from,to);
};

mustReplace(
  "  const[menuOpen,setMenuOpen]=useState(false);",
  "  const[menuOpen,setMenuOpen]=useState(false);\n  const[quickAction,setQuickAction]=useState('');",
  'estado das ações rápidas',
);

mustReplace(
  "  const select=id=>{setActive(id);setMenuOpen(false)};",
  "  const select=id=>{setQuickAction('');setActive(id);setMenuOpen(false)};\n  const openFlow=id=>{setQuickAction(id);setActive(id);setMenuOpen(false)};",
  'navegação das ações rápidas',
);

const legacyRoute="</>:active==='condominios'?<CondominiosPage data={data}/>:active==='moradores'?<MoradoresPage data={data}/>:<OperationalPage id={active} data={data}/>}";
const extendedRoute="</>:active==='condominios'?<CondominiosPage data={data}/>:active==='moradores'?<MoradoresPage data={data}/>:active==='cadastros'?<CadastrosPage data={data}/>:active==='manutencao'?<ManutencaoPage data={data}/>:active==='configuracoes'?<ConfiguracoesPage data={data}/>:<OperationalPage id={active} data={data}/>}";
const legacyTarget="</>:active==='condominios'?<CondominiosPage data={data} initialOpen={quickAction==='condominios'}/>:active==='moradores'?<MoradoresPage data={data} initialOpen={quickAction==='moradores'}/>:<OperationalPage id={active} data={data} initialOpen={quickAction===active}/>}";
const extendedTarget="</>:active==='condominios'?<CondominiosPage data={data} initialOpen={quickAction==='condominios'}/>:active==='moradores'?<MoradoresPage data={data} initialOpen={quickAction==='moradores'}/>:active==='cadastros'?<CadastrosPage data={data}/>:active==='manutencao'?<ManutencaoPage data={data}/>:active==='configuracoes'?<ConfiguracoesPage data={data}/>:<OperationalPage id={active} data={data} initialOpen={quickAction===active}/>}";

if(!source.includes(legacyTarget)&&!source.includes(extendedTarget)){
  if(source.includes(extendedRoute)) source=source.replace(extendedRoute,extendedTarget);
  else if(source.includes(legacyRoute)) source=source.replace(legacyRoute,legacyTarget);
  else{
    console.error('PEM Condomínios: não foi possível aplicar abertura automática dos formulários');
    process.exit(1);
  }
}

mustReplace(
  "function CondominiosPage({data}){\n  const[showForm,setShowForm]=useState(data.condos.length===0);",
  "function CondominiosPage({data,initialOpen=false}){\n  const[showForm,setShowForm]=useState(initialOpen||data.condos.length===0);",
  'fluxo de condomínio',
);

mustReplace(
  "function MoradoresPage({data}){\n  const[showForm,setShowForm]=useState(data.units.length===0);",
  "function MoradoresPage({data,initialOpen=false}){\n  const[showForm,setShowForm]=useState(initialOpen||data.units.length===0);",
  'fluxo de moradores',
);

mustReplace(
  "function OperationalPage({id,data}){\n  if(id==='reservas')return <ReservasPage data={data}/>;",
  "function OperationalPage({id,data,initialOpen=false}){\n  if(id==='reservas')return <ReservasPage data={data} initialOpen={initialOpen}/>;",
  'fluxo operacional',
);

mustReplace(
  "  return <SimpleOperational id={id} cfg={cfg} copy={moduleCopy[id]} records={records} data={data}/>;",
  "  return <SimpleOperational id={id} cfg={cfg} copy={moduleCopy[id]} records={records} data={data} initialOpen={initialOpen}/>;",
  'encaminhamento operacional',
);

mustReplace(
  "function SimpleOperational({id,cfg,copy,records,data}){\n  const[showForm,setShowForm]=useState(false);",
  "function SimpleOperational({id,cfg,copy,records,data,initialOpen=false}){\n  const[showForm,setShowForm]=useState(initialOpen);",
  'formulários operacionais',
);

mustReplace(
  "function ReservasPage({data}){\n  const[showForm,setShowForm]=useState(false);",
  "function ReservasPage({data,initialOpen=false}){\n  const[showForm,setShowForm]=useState(initialOpen);",
  'formulário de reserva',
);

const directFlows=[
  ["<button onClick={()=>select('condominios')}><Plus size={18}/>Novo condomínio</button>","<button onClick={()=>openFlow('condominios')}><Plus size={18}/>Novo condomínio</button>"],
  ["<button onClick={()=>select('reservas')}><CalendarDays size={21}/><div><strong>Nova reserva</strong>","<button onClick={()=>openFlow('reservas')}><CalendarDays size={21}/><div><strong>Nova reserva</strong>"],
  ["<button onClick={()=>select('ocorrencias')}><TriangleAlert size={21}/><div><strong>Novo chamado</strong>","<button onClick={()=>openFlow('ocorrencias')}><TriangleAlert size={21}/><div><strong>Novo chamado</strong>"],
  ["<button onClick={()=>select('moradores')}><Users size={21}/><div><strong>Morador ou unidade</strong>","<button onClick={()=>openFlow('moradores')}><Users size={21}/><div><strong>Morador ou unidade</strong>"],
  ["<button onClick={()=>select('financeiro')}><Wallet size={21}/><div><strong>Registrar pagamento</strong>","<button onClick={()=>openFlow('financeiro')}><Wallet size={21}/><div><strong>Registrar pagamento</strong>"],
];

for(const [from,to] of directFlows){
  if(source.includes(from)) source=source.replace(from,to);
}

fs.writeFileSync(file,source);
console.log('PEM Condomínios: ações rápidas conectadas aos formulários');
