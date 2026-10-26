// EDIT COMPANY DETAILS HERE. These settings apply throughout every page.
const COMPANY = {
  "name": "Emergency Plumber Cardiff Ltd",
  "brand": "Emergency Plumber Cardiff",
  "phone": "07451 294923",
  "email": "info@emergencyplumbingcardiff.uk",
  "address": "8 Park Avenue, Barry, Wales, CF62 7RL",
  "companyNumber": "16753090",
  "url": "emergencyplumbingcardiff.uk"
};

const PAGE_SEO = {
  "index.html": {
    "title": "Emergency Plumber Cardiff | Plumbing & Heating in South Wales",
    "description": "Emergency Plumber Cardiff Ltd: plumbing, heating, boiler repairs, drainage and installations in Cardiff, Barry and South Wales. Call 07451 294923 to book."
  },
  "services.html": {
    "title": "Plumbing & Heating Services | Emergency Plumber Cardiff",
    "description": "Full plumbing and heating service list: boiler repairs, radiators, drains, leaks, bathrooms, kitchens, backflow prevention and guttering in South Wales."
  },
  "plumbing-services.html": {
    "title": "Plumbing repairs | Emergency Plumber Cardiff",
    "description": "From a leaking tap to a burst pipe, practical plumbing help for homes and businesses in Cardiff, Barry and South Wales."
  },
  "gas-and-heating.html": {
    "title": "Gas & heating | Emergency Plumber Cardiff",
    "description": "Boiler work, central heating, radiators and hot water. Call to discuss your heating system and arrange the next step."
  },
  "drainage.html": {
    "title": "Blocked drains & toilets | Emergency Plumber Cardiff",
    "description": "Help with blocked toilets, sinks, pipes and drains, plus drain cleaning and drainage fault finding."
  },
  "bathrooms-and-kitchens.html": {
    "title": "Bathrooms & kitchens | Emergency Plumber Cardiff",
    "description": "Bathroom and kitchen refurbishment plumbing, including installations, taps, sinks, toilets and bidets."
  },
  "backflow-and-external-plumbing.html": {
    "title": "Backflow & external plumbing | Emergency Plumber Cardiff",
    "description": "Backflow prevention, flood-related plumbing, gutters and downpipes for homes and businesses."
  },
  "about.html": {
    "title": "About Emergency Plumber Cardiff Ltd | South Wales",
    "description": "Emergency Plumber Cardiff Ltd is based at 8 Park Avenue, Barry. Plumbing, gas and heating services for homes and businesses across Cardiff and South Wales."
  },
  "contact.html": {
    "title": "Contact Emergency Plumber Cardiff | Call 07451 294923",
    "description": "Call Emergency Plumber Cardiff Ltd on 07451 294923. Based at 8 Park Avenue, Barry, Wales, CF62 7RL. Plumbing and heating across Cardiff and South Wales."
  },
  "privacy.html": {
    "title": "Privacy & Cookies | Emergency Plumber Cardiff Ltd",
    "description": "Information about browsing, contact links and cookies on the Emergency Plumber Cardiff Ltd website."
  }
};
document.querySelectorAll('[data-company]').forEach(el=>{el.textContent=COMPANY[el.dataset.company]??'';});
const digits=COMPANY.phone.replace(/[^\d+]/g,'');
const phone=digits.startsWith('0')?'+44'+digits.slice(1):digits;
document.querySelectorAll('[data-call]').forEach(link=>{link.href='tel:'+phone;});
document.querySelectorAll('[data-email]').forEach(link=>{link.href='mailto:'+COMPANY.email;link.textContent=COMPANY.email;});
document.querySelectorAll('[data-map]').forEach(link=>{link.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(COMPANY.address);});
document.querySelectorAll('[data-year]').forEach(el=>{el.textContent=new Date().getFullYear();});
const file=location.pathname.split('/').pop()||'index.html';
const seo=PAGE_SEO[file]||PAGE_SEO['index.html'];
document.title=seo.title.replaceAll('Emergency Plumber Cardiff',COMPANY.brand).replaceAll('07451 294923',COMPANY.phone);
const description=seo.description.replaceAll('Emergency Plumber Cardiff Ltd',COMPANY.name).replaceAll('07451 294923',COMPANY.phone);
document.querySelector('meta[name="description"]').content=description;
document.querySelector('meta[property="og:title"]').content=document.title;
document.querySelector('meta[property="og:description"]').content=description;
const schemaEl=document.getElementById('business-schema');
const schema=JSON.parse(schemaEl.textContent);
const business=schema['@graph'].find(item=>item['@type']==='Plumber');
business.name=COMPANY.name;business.telephone=phone;business.email=COMPANY.email;business.identifier.value=COMPANY.companyNumber;
business.address={...business.address,streetAddress:COMPANY.address};
schemaEl.textContent=JSON.stringify(schema);
const menu=document.querySelector('.menu'),header=document.querySelector('header');
const closeMenu=()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');header.classList.remove('menu-open');};
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');header.classList.toggle('menu-open',open);});
document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.addEventListener('click',event=>{if(!header.contains(event.target))closeMenu();});

// Domain-specific SEO uses COMPANY.url; live hosting is detected when it is blank.
const configuredSite = COMPANY.url.trim();
const publicHost = /^https?:$/.test(location.protocol) && !['localhost','127.0.0.1','[::1]'].includes(location.hostname);
const detectedSite = publicHost ? new URL('.',location.href).href : '';
const seoBase = configuredSite || detectedSite;
if (seoBase) {
  const base = new URL(seoBase.endsWith('/') ? seoBase : seoBase+'/');
  const pageUrl = new URL(file === 'index.html' ? './' : file,base).href;
  function setSeoLink(rel,value) { let el=document.querySelector('link[rel="'+rel+'"]');if(!el){el=document.createElement('link');el.rel=rel;document.head.appendChild(el);}el.href=value; }
  function setSeoMeta(property,value) { let el=document.querySelector('meta[property="'+property+'"]');if(!el){el=document.createElement('meta');el.setAttribute('property',property);document.head.appendChild(el);}el.content=value; }
  setSeoLink('canonical',pageUrl);
  setSeoMeta('og:url',pageUrl);
  setSeoMeta('og:image',new URL('assets/heating.webp',base).href);
  const liveSchema=JSON.parse(schemaEl.textContent);
  for(const item of liveSchema['@graph']) {
    if(item['@type']==='Plumber') {item['@id']=new URL('#business',base).href;item.url=base.href;item.logo=new URL('assets/logo.png',base).href;item.image=new URL('assets/heating.webp',base).href;}
    if(item['@type']==='WebSite') {item.url=base.href;item.name=COMPANY.brand;}
    if(item['@type']==='WebPage') {item.url=pageUrl;item.name=document.title;item.description=description;item.about={'@id':new URL('#business',base).href};}
    if(item['@type']==='Service') {item.url=pageUrl;item.provider={'@id':new URL('#business',base).href};}
  }
  schemaEl.textContent=JSON.stringify(liveSchema);
}
