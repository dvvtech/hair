(function(){
  const KEY='hairtryon_history';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
  function write(v){localStorage.setItem(KEY,JSON.stringify(v))}
  window.HistoryStore={
    all(){return read().sort((a,b)=>b.ts-a.ts)},
    add(it){const l=read();l.push({id:crypto.randomUUID(),ts:Date.now(),...it});write(l)},
    remove(id){write(read().filter(x=>x.id!==id))},
    stats(){const l=read();return{total:l.length,last:l.length?new Date(Math.max(...l.map(x=>x.ts))):null}}
  };
  function renderHistory(){
    const root=document.getElementById('historyList'); if(!root) return;
    const list=HistoryStore.all(); root.innerHTML='';
    if(!list.length){ const empty=document.createElement('div'); empty.className='card p-6 text-center text-neutral-600'; empty.textContent='История пуста'; root.appendChild(empty); return; }
    list.forEach(it=>{
      const card=document.createElement('article'); card.className='card overflow-hidden';
      const grid=document.createElement('div'); grid.className='grid grid-cols-3 gap-0';
      [it.userUrl,it.hairUrl,it.resultUrl].forEach((src,i)=>{ const img=document.createElement('img'); img.src=src; img.alt=['Пользователь','Прическа','Результат'][i]; img.className='thumb rounded-none border-0'; grid.appendChild(img); });
      const row=document.createElement('div'); row.className='flex items-center justify-between p-3';
      const time=document.createElement('time'); time.className='text-sm text-neutral-600'; time.textContent=new Date(it.ts).toLocaleString();
      const del=document.createElement('button'); del.className='btn'; del.textContent='Удалить'; del.onclick=()=>{HistoryStore.remove(it.id); renderHistory();};
      row.append(time,del); card.append(grid,row); root.appendChild(card);
    });
  }
  document.addEventListener('view:history',renderHistory);
})();