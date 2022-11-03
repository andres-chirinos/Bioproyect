//asignar un nombre y versión al cache
const CACHE_NAME = 'CacheFocusing_0.1.0',
  urlsToCache = [
    '/',
    '/static/css/main.css',
    '/static/img/icon_16.png',
    '/static/img/icon_144.png',
    '/static/js/sw.js',
    '/static/js/main.js',
    '/static/js/redirect.html',
    '/static/manifest.json',
  ]

/**
 * Notifications Funtions
 */

 function notifyMe(title, options) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {

    alert("This browser does not support desktop notification");
    
  }

  else if (Notification.permission === "granted") {
    if (title !== null) {
      var notification = new Notification(title, options);
    }
  }

  else if (Notification.permission !== 'denied') {

    alert("Please you need accept the notifications");

    Notification.requestPermission(function (permission) {

      if (permission === "granted") {
        var notification = new Notification(title = 'Notifications On', options = {body: 'Thanks for turn on the notifications', icon: '/static/img/icon_144.png'});
      } 

    });
  }
}

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})