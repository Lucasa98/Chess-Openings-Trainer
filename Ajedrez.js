class Ajedrez{
    constructor(){
        // Canvas que contiene todo el espacio de dibujo
        this.canvas = document.getElementById("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.heigth = window.innerHeight;

        // Context
        this.ctx = this.canvas.getContext('2d');

        // Listeners (en vez pool de eventos)
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        })

        // Preload sprites
        this.rsc = new Map();
        Promise.all([
            scene.preloadImage('tablero','/sprites/tablero.png'),
            //scene.preloadImage('sprites/caballo.png'),
            //scene.preloadImage('sprites/alfil.png'),
            //...
          ])
          .then(function(preloadedImages) {
            console.log('All images are preloaded:', preloadedImages);
            // Draw preloaded images whenever needed
            scene.drawPreloadedImages();
          })
          .catch(function(error) {
            console.error(error.message);
          });

        // Escena inicial (menu)
        this.scene = new Menu();
    }

    Play(){
        // pedimos que en el siguiente frame tambien llame a Play()
        // (es como el loop while(window.isOpen()))
        window.requestAnimationFrame(this.Play());
        
        // Lo que se debe dibujar en el proximo frame
        // clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.heigth);
        
        // update
        this.scene.update(this.canvas);

        // draw
        this.scene.draw(this.ctx);
    }

    // Metodo para precargar sprites
    preloadImage = function(key, imageSrc) {
        var self = this;
        return new Promise(function(resolve, reject) {
          var image = new Image();
          image.onload = function() {
            self.rsc.set(key,image)
            resolve(image);
          };
          image.onerror = function() {
            reject(new Error('Failed to load image: ' + imageSrc));
          };
          image.src = imageSrc;
        });
      };

    // Listeners ( ProcessEvents )
    resizeCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.heigth = window.innerHeight;
    }
}