/* 321職場生活 service worker — 版本 1.0.10050122（每次建置自動更新，舊版會自動被取代） */
var C='worklife321-1.0.10050122';
var F=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./hero.jpg'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return Promise.all(F.map(function(u){return c.add(new Request(u,{cache:'reload'}))['catch'](function(){});}));}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C;}).map(function(x){return caches['delete'](x);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('message',function(e){if(e.data==='skip')self.skipWaiting();});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||r.url.indexOf(self.location.origin)!==0)return;
  if(r.url.indexOf('version.json')>=0){e.respondWith(fetch(r,{cache:'no-store'}));return;}
  var nav=r.mode==='navigate'||/\/(index\.html)?(\?.*)?$/.test(r.url);
  e.respondWith(fetch(nav?new Request(r.url,{cache:'no-store'}):r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp);});}return res;})['catch'](function(){
    return caches.match(r,{ignoreSearch:true}).then(function(x){return x||(nav?caches.match('./index.html'):undefined);});}));});
