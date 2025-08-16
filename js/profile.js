(function(){
  function renderProfile(){
    const u=Auth.user()||{};
    const stats=HistoryStore.stats();
    const id=document.getElementById('profIdentity'); if(!id) return;
    id.textContent=u.id||'—';
    document.getElementById('profAuthType').textContent=u.provider||'—';
    document.getElementById('profTotal').textContent=String(stats.total);
    document.getElementById('profLast').textContent=stats.last?stats.last.toLocaleString():'—';
  }
  document.addEventListener('view:profile',renderProfile);
})();