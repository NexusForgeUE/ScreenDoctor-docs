"use strict";
(() => {
  const sidebar = document.querySelector('#sidebar');
  const menu = document.querySelector('#menu-toggle');
  const search = document.querySelector('#doc-search');
  const results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  const sections = [...document.querySelectorAll('main > section')];
  const links = [...sidebar.querySelectorAll('nav > a')];
  const normalize = text => text.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase().replace(/\s+/g,' ').trim();
  const entries = sections.map(section=>({id:section.id,title:section.querySelector('h1,h2').textContent,text:section.textContent}));
  const activate = id => links.forEach(link=>link.hash === '#'+id ? link.setAttribute('aria-current','location') : link.removeAttribute('aria-current'));
  const closeMenu = () => {sidebar.classList.remove('is-open');menu.setAttribute('aria-expanded','false');};
  menu.addEventListener('click',()=>{const open=sidebar.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));if(open)search.focus();});
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(link){const section=document.getElementById(link.hash.slice(1));if(section){activate(section.id);closeMenu();if(section.matches('section')){section.tabIndex=-1;section.focus({preventScroll:true});}}}
    else if(!sidebar.contains(event.target)&&!menu.contains(event.target))closeMenu();
  });
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(matchMedia('(max-width: 880px)').matches){sidebar.classList.add('is-open');menu.setAttribute('aria-expanded','true');}search.focus();}
    if(event.key==='Escape'){results.hidden=true;if(sidebar.classList.contains('is-open')){closeMenu();menu.focus();}}
  });
  search.addEventListener('input',()=>{
    results.replaceChildren();
    const query=normalize(search.value);
    if(!query){results.hidden=true;status.textContent='';return;}
    const words=query.split(' ');
    const found=entries.filter(entry=>words.every(word=>normalize(entry.title+' '+entry.text).includes(word))).sort((a,b)=>Number(normalize(b.title).includes(query))-Number(normalize(a.title).includes(query)));
    status.textContent=document.body.dataset.searchCount.replace('{count}',String(found.length));
    if(!found.length){const message=document.createElement('p');message.textContent=document.body.dataset.searchEmpty;results.append(message);}
    for(const entry of found.slice(0,8)){const link=document.createElement('a');link.href='#'+entry.id;link.textContent=entry.title;results.append(link);}
    results.hidden=false;
  });
  search.addEventListener('keydown',event=>{if(!results.hidden&&['Enter','ArrowDown'].includes(event.key)){const first=results.querySelector('a');if(first){event.preventDefault();if(event.key==='Enter')first.click();else first.focus();}}});
  results.addEventListener('click',event=>{if(event.target.closest('a')){results.hidden=true;search.value='';}});
  document.querySelector('#doc-locale').addEventListener('change',event=>{
    const root=new URL(document.querySelector('meta[name="site-root"]').content,document.baseURI);
    const destination=new URL(event.target.value==='en'?'index.html':event.target.value+'/index.html',root);
    destination.hash=location.hash;location.assign(destination.href);
  });
  document.querySelector('#print-guide').addEventListener('click',()=>window.print());
  window.addEventListener('beforeprint',()=>document.querySelectorAll('details').forEach(detail=>{detail.dataset.wasOpen=String(detail.open);detail.open=true;}));
  window.addEventListener('afterprint',()=>document.querySelectorAll('details').forEach(detail=>{detail.open=detail.dataset.wasOpen==='true';delete detail.dataset.wasOpen;}));
  let scheduled=false;
  const track=()=>{scheduled=false;const threshold=100;let current=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=threshold)current=section;else break;}activate(current.id);};
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(track);}},{passive:true});
  window.addEventListener('hashchange',()=>activate(location.hash.slice(1)||'overview'));
  activate(location.hash.slice(1)||'overview');
})();
