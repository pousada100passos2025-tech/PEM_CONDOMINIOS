import fs from 'node:fs';

const main=fs.readFileSync('src/main.jsx','utf8');
const css=[
  fs.existsSync('src/app.css')?fs.readFileSync('src/app.css','utf8'):'',
  fs.existsSync('src/condo-brand.css')?fs.readFileSync('src/condo-brand.css','utf8'):'',
  fs.existsSync('src/dashboard-premium.css')?fs.readFileSync('src/dashboard-premium.css','utf8'):'',
].join('\n');

const requiredMain=[
  'PEM_DASHBOARD_PREMIUM',
  'CENTRAL DE OPERAÇÃO',
  'Reservas hoje',
  'Chamados abertos',
  'Manutenções pendentes',
  'AÇÕES RÁPIDAS',
  'Próximas reservas',
  'ATIVIDADE RECENTE',
  "import'./dashboard-premium.css';",
  "const[quickAction,setQuickAction]=useState('');",
  'const openFlow=id=>',
  "openFlow('condominios')",
  "openFlow('reservas')",
  "openFlow('ocorrencias')",
  "openFlow('moradores')",
  "openFlow('financeiro')",
  "initialOpen={quickAction==='condominios'}",
  "initialOpen={quickAction==='moradores'}",
  'initialOpen={quickAction===active}',
];
const requiredCss=['premium-command-center','premium-kpi-grid','premium-ops-grid'];

const missing=[
  ...requiredMain.filter(item=>!main.includes(item)).map(item=>`src/main.jsx: ${item}`),
  ...requiredCss.filter(item=>!css.includes(item)).map(item=>`CSS: ${item}`),
];

if(missing.length){
  console.error('PEM Condomínios: dashboard/fluxos incompletos');
  missing.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}

console.log('PEM Condomínios: dashboard premium e fluxos verificados');
