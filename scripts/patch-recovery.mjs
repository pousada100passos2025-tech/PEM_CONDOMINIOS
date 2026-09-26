import fs from 'node:fs';

const file='src/main.jsx';
let source=fs.readFileSync(file,'utf8');

const oldReset="supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin})";
const newReset="supabase.auth.resetPasswordForEmail(email,{redirectTo:(window.location.hostname==='localhost'?'https://pemcondominios.vercel.app':window.location.origin)})";
if(source.includes(oldReset)) source=source.replace(oldReset,newReset);

const oldApp=`function App(){
  const[session,setSession]=useState(null);
  const[loadingSession,setLoadingSession]=useState(true);
  const[busy,setBusy]=useState(false);
  useEffect(()=>{if(!supabase){setLoadingSession(false);return}supabase.auth.getSession().then(({data})=>{setSession(data.session||null);setLoadingSession(false)});const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>setSession(nextSession||null));return()=>subscription.unsubscribe()},[]);
  async function logout(){if(!supabase)return;setBusy(true);await supabase.auth.signOut();setSession(null);setBusy(false)}
  if(loadingSession)return <main className="loading-page">Carregando...</main>;
  return session?<Dashboard session={session} onLogout={logout} busy={busy}/>:<AuthScreen/>;
}`;

const newApp=`function RecoveryPasswordScreen({onDone}){
  const[password,setPassword]=useState('');
  const[confirmPassword,setConfirmPassword]=useState('');
  const[showPassword,setShowPassword]=useState(false);
  const[msg,setMsg]=useState('');
  const[busy,setBusy]=useState(false);
  async function submit(e){
    e.preventDefault();setMsg('');
    if(password.length<6){setMsg('A nova senha precisa ter pelo menos 6 caracteres.');return}
    if(password!==confirmPassword){setMsg('As senhas não coincidem.');return}
    setBusy(true);
    const{error}=await supabase.auth.updateUser({password});
    if(error){setMsg(error.message||'Não foi possível atualizar a senha.');setBusy(false);return}
    window.history.replaceState(null,'',window.location.pathname);
    setMsg('Senha alterada com sucesso.');
    setBusy(false);
    setTimeout(()=>onDone(),500);
  }
  return <main className="page"><section className="brand"><img className="brand-logo" src="/pem-condominios-logo.jpg" alt="PEM Condomínios - Gestão Condominial Inteligente"/></section><section className="card"><div className="intro"><span>SEGURANÇA DA CONTA</span><h2>Criar nova senha</h2><p>Defina uma nova senha para concluir a recuperação do seu acesso.</p></div><form onSubmit={submit}><label>Nova senha<div className="field"><Lock size={18}/><input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" minLength={6} required/><button type="button" className="password-toggle" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label><label>Confirmar nova senha<div className="field"><Lock size={18}/><input type={showPassword?'text':'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="••••••••" minLength={6} required/></div></label><button type="submit" disabled={busy}>{busy?'Salvando...':'Salvar nova senha'}<ArrowRight size={18}/></button>{msg&&<div className="msg">{msg}</div>}</form><small>PEM Condomínios · Professional Event Management</small></section></main>;
}

function App(){
  const[session,setSession]=useState(null);
  const[loadingSession,setLoadingSession]=useState(true);
  const[busy,setBusy]=useState(false);
  const[recovering,setRecovering]=useState(()=>window.location.hash.includes('type=recovery'));
  useEffect(()=>{if(!supabase){setLoadingSession(false);return}supabase.auth.getSession().then(({data})=>{setSession(data.session||null);setLoadingSession(false)});const{data:{subscription}}=supabase.auth.onAuthStateChange((event,nextSession)=>{setSession(nextSession||null);if(event==='PASSWORD_RECOVERY')setRecovering(true)});return()=>subscription.unsubscribe()},[]);
  async function logout(){if(!supabase)return;setBusy(true);await supabase.auth.signOut();setSession(null);setBusy(false)}
  if(loadingSession)return <main className="loading-page">Carregando...</main>;
  if(recovering&&session)return <RecoveryPasswordScreen onDone={()=>setRecovering(false)}/>;
  return session?<Dashboard session={session} onLogout={logout} busy={busy}/>:<AuthScreen/>;
}`;

if(source.includes(oldApp)) source=source.replace(oldApp,newApp);

fs.writeFileSync(file,source);
