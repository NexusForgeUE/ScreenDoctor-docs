import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locales = [['en','English'],['zh-Hans','简体中文'],['ru','Русский'],['es','Español'],['pt-BR','Português (Brasil)'],['de','Deutsch'],['ja','日本語'],['fr','Français'],['ko','한국어']];
const chapters = ['overview','installation','first-check','fixture','scenarios','widgets','matrix','runs','layout','baselines','input','automation','packaging','troubleshooting','faq','reference'];
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

for (const [locale] of locales) {
  const {default: data} = await import(`../content/${locale}.mjs`);
  if (data.lang !== locale || chapters.some(id => !data.sections[id]?.title || !data.sections[id]?.body)) throw new Error(`Incomplete locale: ${locale}`);
  const prefix = locale === 'en' ? './' : '../';
  const asset = prefix + 'assets';
  const nav = chapters.map((id,index) => `${[0,3,6,10,13].includes(index) ? `<p class="nav-group">${escape(data.groups[[0,3,6,10,13].indexOf(index)])}</p>` : ''}<a href="#${id}"${index===0?' aria-current="location"':''}>${escape(data.sections[id].title)}</a>`).join('\n');
  const sections = chapters.map((id,index) => `<section class="doc-section${index===0?' overview':''}" id="${id}" aria-labelledby="${id}-title"><${index===0?'h1':'h2'} id="${id}-title">${escape(data.sections[id].title)}</${index===0?'h1':'h2'}>${data.sections[id].body.replaceAll('{{assets}}',asset)}</section>`).join('\n');
  const html = `<!doctype html>
<html lang="${escape(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="site-root" content="${prefix}"><meta name="description" content="${escape(data.description)}"><title>ScreenDoctor | ${escape(data.ui.documentation)}</title><link rel="icon" href="${asset}/brand.png"><link rel="stylesheet" href="${asset}/style.css"><script src="${asset}/app.js" defer></script></head>
<body data-search-count="${escape(data.ui.searchCount)}" data-search-empty="${escape(data.ui.searchEmpty)}">
<a class="skip-link" href="#main">${escape(data.ui.skip)}</a>
<header class="site-header"><a class="brand" href="#overview" aria-label="ScreenDoctor"><img src="${asset}/brand.png" width="42" height="42" alt=""><span>ScreenDoctor</span></a><span class="header-label">${escape(data.ui.documentation)}</span><div class="header-actions"><span class="version">UE 5.5-5.8</span><label class="language-picker"><span class="visually-hidden">${escape(data.ui.language)}</span><select id="doc-locale" aria-label="${escape(data.ui.language)}">${locales.map(([code,name])=>`<option value="${code}"${code===locale?' selected':''}>${name}</option>`).join('')}</select></label><button type="button" id="print-guide">${escape(data.ui.print)}</button><button type="button" class="menu-button" id="menu-toggle" aria-controls="sidebar" aria-expanded="false">${escape(data.ui.menu)}</button></div></header>
<div class="site-layout"><aside class="sidebar" id="sidebar"><div class="search-box"><label for="doc-search">${escape(data.ui.search)}</label><input id="doc-search" type="search" placeholder="${escape(data.ui.searchPlaceholder)}" autocomplete="off" aria-controls="search-results"><div id="search-results" hidden></div><p id="search-status" class="visually-hidden" role="status"></p></div><nav aria-label="${escape(data.ui.chapters)}">${nav}</nav><div class="sidebar-footer">ScreenDoctor 1.0.0<br>Unreal Engine 5.5 / 5.6 / 5.7 / 5.8<br>Windows 64-bit</div></aside><main id="main" tabindex="-1">${sections}<footer class="page-footer"><a href="#overview">${escape(data.ui.top)}</a><span>Copyright NexusForgeUE. All Rights Reserved.</span></footer></main></div>
</body></html>\n`;
  const directory = locale === 'en' ? root : path.join(root, locale);
  await mkdir(directory,{recursive:true});
  await writeFile(path.join(directory,'index.html'), html, 'utf8');
  console.log(`${locale}: ${chapters.length} chapters`);
}
