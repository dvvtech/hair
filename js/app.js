(function(){
  const view=document.getElementById('view'); const loader=document.getElementById('loader');
  const ROUTES={'/home':'pages/home.html','/try-on':'pages/tryon.html','/history':'pages/history.html','/profile':'pages/profile.html'};
  const CACHE=new Map();
  function showLoader(v){ if(v){loader.classList.remove('hidden'); loader.classList.add('flex');} else {loader.classList.add('hidden'); loader.classList.remove('flex');} }
  async function loadPage(path){ showLoader(true); try { const html=CACHE.get(path)||await (await fetch(path,{cache:'no-store'})).text(); CACHE.set(path,html); view.innerHTML=html; afterMount(); } finally { showLoader(false); } }
  function route(){ const target=(location.hash||'#/home').replace('#',''); loadPage(ROUTES[target]||ROUTES['/home']).then(()=>{ if(target==='/history') document.dispatchEvent(new CustomEvent('view:history')); if(target==='/profile') document.dispatchEvent(new CustomEvent('view:profile')); }); }
  async function callTryOnApi(userUrl,hairUrl){ await new Promise(r=>setTimeout(r,800)); return 'https://picsum.photos/seed/'+encodeURIComponent(userUrl+hairUrl)+'/1200/800'; }
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
      showLoader(true); try { const url=await callTryOnApi(u,h); resultImg.src=url; if(window.HistoryStore){ HistoryStore.add({userUrl:u,hairUrl:h,resultUrl:url}); } } finally { showLoader(false); }
    }); }
  }
  window.addEventListener('hashchange',route); document.addEventListener('DOMContentLoaded',route);
})();