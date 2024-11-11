
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v1').then((cache) => {
        return cache.addAll([
          '/Mainpage.png',  // Add paths to the images you want to cache
          '/windowIcon.png',
          '/lock.png',
          '/backButton.png' 
          // Add more images or other files as needed
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });