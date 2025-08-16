(function(){
  const KEY='hairtryon_auth';
  function get(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
  function set(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function clear(){localStorage.removeItem(KEY)}
  window.Auth={
    isAuthed(){return !!get()},
    user(){return get()},
    login(provider){const id=prompt('Введите email (демо):','user@example.com');if(!id)return;set({id,provider});document.dispatchEvent(new CustomEvent('auth:changed'))},
    logout(){clear();document.dispatchEvent(new CustomEvent('auth:changed'))}
  };
  function renderAuthArea(){
    const area=document.getElementById('authArea'); if(!area) return; area.innerHTML='';
    if(Auth.isAuthed()){
      const who=document.createElement('span'); who.textContent=Auth.user().id;
      const out=document.createElement('button'); out.textContent='Выйти'; out.className='btn'; out.onclick=()=>Auth.logout();
      area.append(who,out);
    } else {
      const p=['google','vk','yandex','mail','internal'];
      p.forEach(x=>{ const b=document.createElement('button'); b.className='btn'; b.textContent='Войти: '+x; b.onclick=()=>Auth.login(x); area.appendChild(b); });
    }
  }
  document.addEventListener('DOMContentLoaded',renderAuthArea);
  document.addEventListener('auth:changed',renderAuthArea);
})();