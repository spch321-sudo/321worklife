/* 321職場生活 service worker — 版本 1.0.10050122（每次建置自動更新，舊版會自動被取代） */
var C='worklife321-1.0.10050122-gx10171750-gxa1019-vp1023-cr1031-ws3-fs1103-xz1103-au1103-xzm1103-rf1105-fw1105hpar';
var F=['./','./index.html','./xz2.js', './xzm.js','./xzpar.js','./lang-zs.json','./lang-en.json','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./hero.jpg','./peerjs.min.js','./qrcode.js'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return Promise.all(F.map(function(u){return c.add(new Request(u,{cache:'reload'}))['catch'](function(){});}));}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C&&x.indexOf('worklife321-')===0;}).map(function(x){return caches['delete'](x);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('message',function(e){if(e.data==='skip')self.skipWaiting();});
/* v-rf1105：網路優先，但慢網路（超過 SHELL_WAIT 毫秒沒回）先用「完全相同」的快取開；網路那份繼續下載並更新快取。
   只有導覽請求才可以退回 index.html（程式檔退回 HTML 會造成 Unexpected token '<'）。 */
var SHELL_WAIT = 1000;
function shellFetch(e, req, key, url, nav) {
  var net = fetch(url).then(function (resp) {
    if (resp && resp.ok) { var cp = resp.clone(); caches.open(C).then(function (c) { c.put(key, cp); }); }
    return resp;
  });
  e.waitUntil(net.then(function () { }, function () { }));
  function fallback() {
    return caches.match(key).then(function (h) { return h || caches.match(req, { ignoreSearch: true }); })
      .then(function (h) { return h || (nav ? caches.match('./index.html') : undefined); });
  }
  return new Promise(function (resolve) {
    var done = false;
    var t = setTimeout(function () { fallback().then(function (h) { if (h && !done) { done = true; resolve(h); } }); }, SHELL_WAIT);
    net.then(function (resp) { if (!done) { done = true; clearTimeout(t); resolve(resp); } }, function () {
      clearTimeout(t);
      if (done) return;
      fallback().then(function (h) { if (!done) { done = true; resolve(h || Response.error()); } });
    });
  });
}
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||r.url.indexOf(self.location.origin)!==0)return;
  if(r.url.indexOf('version.json')>=0){e.respondWith(fetch(r,{cache:'no-store'}));return;}
  var nav=r.mode==='navigate'||/\/(index\.html)?(\?.*)?$/.test(r.url);
  e.respondWith(shellFetch(e,r,nav?'./index.html':r,nav?new Request(r.url,{cache:'no-store'}):r,nav));});
