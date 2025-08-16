(function(){
  const view=document.getElementById('view'); const loader=document.getElementById('loader');
  const ROUTES={'/home':'pages/home.html','/try-on':'pages/tryon.html','/history':'pages/history.html','/profile':'pages/profile.html'};
  const CACHE=new Map();
  function showLoader(v){ if(v){loader.classList.remove('hidden'); loader.classList.add('flex');} else {loader.classList.add('hidden'); loader.classList.remove('flex');} }
  async function loadPage(path){
    showLoader(true);
    try{
      const html=CACHE.get(path)||await (await fetch(path,{cache:'no-store'})).text();
      CACHE.set(path,html);
      view.innerHTML=html;
      view.classList.remove('animate-in'); // restart animation
      void view.offsetWidth;
      view.classList.add('animate-in');
      afterMount();
    } finally { showLoader(false); }
  }
  function setActiveLinks(target){
    document.querySelectorAll('[data-nav]').forEach(a=>{
      a.classList.toggle('tablink-active', a.getAttribute('data-nav')===target);
    });
  }
  function route(){
    const target=(location.hash||'#/home').replace('#','');
    setActiveLinks(target);
    loadPage(ROUTES[target]||ROUTES['/home']).then(()=>{
      if(target==='/history') document.dispatchEvent(new CustomEvent('view:history'));
      if(target==='/profile') document.dispatchEvent(new CustomEvent('view:profile'));
      if(target==='/home') mountHomeCta();
    });
  }
  function mountHomeCta(){
    const el=document.getElementById('homeAuthCta'); if(!el) return;
    el.innerHTML='';
    if(window.Auth?.isAuthed()){
      const a=document.createElement('a'); a.href='#/try-on'; a.textContent='Перейти к примерке'; a.className='btn'; el.appendChild(a);
    } else {
      const p=document.createElement('p'); p.className='text-neutral-600 dark:text-neutral-400'; p.textContent='Войдите, чтобы начать примерку'; el.appendChild(p);
      ['google','vk','yandex','mail','internal'].forEach(provider=>{
        const b=document.createElement('button'); b.textContent='Войти: '+provider; b.className='btn'; b.onclick=()=>{ Auth.login(provider); route(); }; el.appendChild(b);
      });
    }
  }
  async function callTryOnApi(userUrl,hairUrl){
    await new Promise(r=>setTimeout(r,800));
    return 'https://picsum.photos/seed/'+encodeURIComponent(userUrl+hairUrl)+'/1200/800';
  }
  function afterMount(){
    const inputUser=document.getElementById('inputUser'); const inputUserUrl=document.getElementById('inputUserUrl'); const previewUser=document.getElementById('previewUser');
    const inputHair=document.getElementById('inputHair'); const inputHairUrl=document.getElementById('inputHairUrl'); const previewHair=document.getElementById('previewHair');
    const btnTryOn=document.getElementById('btnTryOn'); const resultImg=document.getElementById('resultImg');
    if(inputUser){ inputUser.addEventListener('change', e=>{ const f=e.target.files?.[0]; if(f) previewUser.src=URL.createObjectURL(f);}); }
    if(inputUserUrl){ inputUserUrl.addEventListener('input', e=>{ previewUser.src=e.target.value;}); }
    if(inputHair){ inputHair.addEventListener('change', e=>{ const f=e.target.files?.[0]; if(f) previewHair.src=URL.createObjectURL(f);}); }
    if(inputHairUrl){ inputHairUrl.addEventListener('input', e=>{ previewHair.src=e.target.value;}); }
    if(btnTryOn){ btnTryOn.addEventListener('click', async ()=>{
      const u=previewUser?.src; const h=previewHair?.src; if(!u||!h){ alert('Загрузите обе картинки или вставьте URL'); return; }
      showLoader(true);
      try { const url=await callTryOnApi(u,h); resultImg.src=url; if(window.HistoryStore){ HistoryStore.add({userUrl:u,hairUrl:h,resultUrl:url}); } }
      finally { showLoader(false); }
    }); }
  }
  // theme toggle
  (function theme(){
    const root=document.documentElement;
    const key='hairtryon_theme';
    const saved=localStorage.getItem(key);
    if(saved==='dark'){ root.classList.add('dark'); }
    const btn=document.getElementById('themeToggle');
    function updateIcons(){
      const isDark=root.classList.contains('dark');
      document.getElementById('iconSun').classList.toggle('hidden', isDark);
      document.getElementById('iconMoon').classList.toggle('hidden', !isDark);
    }
    btn?.addEventListener('click',()=>{
      root.classList.toggle('dark');
      localStorage.setItem(key, root.classList.contains('dark') ? 'dark' : 'light');
      updateIcons();
    });
    updateIcons();
  })();
  window.addEventListener('hashchange',route);
  document.addEventListener('DOMContentLoaded',route);
  document.addEventListener('auth:changed',route);
})();