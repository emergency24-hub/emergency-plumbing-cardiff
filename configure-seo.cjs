const fs=require('fs'),path=require('path');
const root=__dirname;
const source=fs.readFileSync(path.join(root,'script.js'),'utf8');
const company=JSON.parse(source.match(/const COMPANY = (\{[\s\S]*?\n\});/)[1]);
const pages=JSON.parse(source.match(/const PAGE_SEO = (\{[\s\S]*?\n\});/)[1]);
if(!company.url.trim()){console.error('Set COMPANY.url at the top of script.js to your new website address, then run Update-SEO.cmd again.');process.exit(1);}
let base;
try {base=new URL(company.url.endsWith('/')?company.url:company.url+'/');if(!['http:','https:'].includes(base.protocol)||base.search||base.hash)throw Error();}catch{console.error('Use a complete website address such as https://your-domain/ without a query or fragment.');process.exit(1);}
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const digits=company.phone.replace(/[^+\d]/g,'');const phone=digits.startsWith('0')?'+44'+digits.slice(1):digits;
for(const [file,seo]of Object.entries(pages)){
 const p=path.join(root,file);let html=fs.readFileSync(p,'utf8');
 const title=seo.title.replaceAll('Emergency Plumber Cardiff',company.brand).replaceAll('07451 294923',company.phone);
 const description=seo.description.replaceAll('Emergency Plumber Cardiff Ltd',company.name).replaceAll('07451 294923',company.phone);
 const url=new URL(file==='index.html'?'./':file,base).href;
 html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(title)+'</title>');
 html=html.replace(/<meta name="description"[^>]*>/,'<meta name="description" content="'+escape(description)+'">');
 html=html.replace(/<link rel="canonical"[^>]*>/g,'').replace(/<meta property="og:(?:title|description|url|image)"[^>]*>/g,'');
 html=html.replace('</head>',`<link rel="canonical" href="${escape(url)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(new URL('assets/heating.webp',base).href)}"></head>`);
 html=html.replace(/(<span data-company="([^"]+)">)[\s\S]*?(<\/span>)/g,(all,start,key,end)=>company[key]===undefined?all:start+escape(company[key])+end);
 html=html.replace(/(<a\b[^>]*data-call[^>]*href=")[^"]*/g,'$1tel:'+phone);
 html=html.replace(/(<a\b[^>]*data-email[^>]*href=")[^"]*/g,'$1mailto:'+escape(company.email));
 html=html.replace(/(<a\b[^>]*data-email[^>]*>)[\s\S]*?(<\/a>)/g,(_,start,end)=>start+escape(company.email)+end);
 html=html.replace(/(<a\b[^>]*data-map[^>]*href=")[^"]*/g,'$1https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(company.address));
 html=html.replace(/<script type="application\/ld\+json" id="business-schema">([\s\S]*?)<\/script>/,(_,json)=>{
   const schema=JSON.parse(json);
   for(const item of schema['@graph']){
    if(item['@type']==='Plumber'){item['@id']=new URL('#business',base).href;item.name=company.name;item.url=base.href;item.telephone=phone;item.email=company.email;item.logo=new URL('assets/logo.png',base).href;item.image=new URL('assets/heating.webp',base).href;item.identifier.value=company.companyNumber;item.address.streetAddress=company.address;}
    if(item['@type']==='WebSite'){item.url=base.href;item.name=company.brand;}
    if(item['@type']==='WebPage'){item.url=url;item.name=title;item.description=description;item.about={'@id':new URL('#business',base).href};}
    if(item['@type']==='Service'){item.url=url;item.provider={'@id':new URL('#business',base).href};}
   }
   return '<script type="application/ld+json" id="business-schema">'+JSON.stringify(schema).replaceAll('<','\\u003c')+'</script>';
 });
 fs.writeFileSync(p,html);
}
const indexable=Object.keys(pages).filter(f=>f!=='privacy.html');
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+indexable.map(f=>'<url><loc>'+escape(new URL(f==='index.html'?'./':f,base).href)+'</loc></url>').join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+new URL('sitemap.xml',base).href+'\n');
const cname=path.join(root,'CNAME');
if(base.pathname==='/'&&!base.hostname.endsWith('.github.io'))fs.writeFileSync(cname,base.hostname+'\n');
else if(fs.existsSync(cname))fs.unlinkSync(cname);
console.log('SEO configured for '+base.href+'\nUpdated all page metadata, contact fallbacks, structured data, sitemap.xml, robots.txt and hosting domain.');
