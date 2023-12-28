class Ajedrez{
  constructor(){
    //Enlazar el this de Play al this de Ajedrez
    this.Play = this.Play.bind(this);

    // Canvas que contiene todo el espacio de dibujo
    const scaleFactor = window.devicePixelRatio;
    // Set canvas size attributes
    canvas.width = window.innerWidth * scaleFactor;
    canvas.height = window.innerHeight * scaleFactor;
    

    // Context
    this.ctx = this.canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);

    // Listeners (en vez pool de eventos)
    window.addEventListener('resize', () => {
        this.resizeCanvas();
    })

    // Preload sprites
    this.LOADED = false;
    this.rsc = new Map();
    var self = this;
    Promise.all([
        this.preloadImage('tablero','./sprites/tablero.png'),
        //this.preloadImage('sprites/caballo.png'),
        //this.preloadImage('sprites/alfil.png'),
        //...
      ])
      .then(function(preloadedImages) {
        console.log('All images are preloaded:', preloadedImages);
        self.LOADED = true;
        self.scene = new Game(self.rsc, self.ctx, self.canvas);
      })
      .catch(function(error) {
        console.error(error.message);
      });

    // Escena inicial (menu)
    //this.scene = new Menu(this.rsc);
  }

  Play(){
      // pedimos que en el siguiente frame tambien llame a Play()
      // (es como el loop while(window.isOpen()))
      window.requestAnimationFrame(this.Play);
      
      if(this.LOADED){
        // Lo que se debe dibujar en el proximo frame
        // clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.heigth);
        
        // update
        this.scene.update(this.canvas);

        // draw
        this.scene.draw(this.ctx);

        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, Math.PI * 2, false);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(100, 0, 5, 0, Math.PI * 2, false);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(0, 100, 5, 0, Math.PI * 2, false);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(100, 100, 5, 0, Math.PI * 2, false);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
        this.ctx.closePath();
      }else{
        console.log('not yet loaded');
      }
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
      console.log(this.canvas.width);
      console.log(this.canvas.height);
  }
}