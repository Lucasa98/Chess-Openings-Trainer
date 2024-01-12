class Ajedrez{
  constructor(){
    //Enlazar el this de Play al this de Ajedrez
    this.Play = this.Play.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    
    // Canvas que contiene todo el espacio de dibujo
    this.canvas = document.getElementById("canvas");

    // Context
    this.ctx = this.canvas.getContext('2d');

    // Preload sprites
    this.LOADED = false;
    RSC = new Map();
    var self = this;
    Promise.all([
      this.preloadImage('tablero','./sprites/tablero.png'),
      this.preloadImage('kw','sprites/kw.png'),
      this.preloadImage('kb','sprites/kb.png'),
      this.preloadImage('qb','sprites/qb.png'),
      this.preloadImage('qw','sprites/qw.png'),
      this.preloadImage('bb','sprites/bb.png'),
      this.preloadImage('bw','sprites/bw.png'),
      this.preloadImage('nb','sprites/nb.png'),
      this.preloadImage('nw','sprites/nw.png'),
      this.preloadImage('rb','sprites/rb.png'),
      this.preloadImage('rw','sprites/rw.png'),
      this.preloadImage('pb','sprites/pb.png'),
      this.preloadImage('pw','sprites/pw.png'),
      this.preloadImage('marca','sprites/marca.png')
    ])
    .then(function(preloadedImages) {
      console.log('All images are preloaded:', preloadedImages);
      self.LOADED = true;

      // Escena Inicial (Game para debugear, deberia ser Menu)
      self.game = new Game(self.ctx, self.canvas);
    })
    .catch(function(error) {
      // Check if the error object has a message property
      if (error && error.message) {
        console.error(error.message);
      } else {
          console.error('An error occurred:', error);
      }
    });

    // Listeners (Events processors)
    window.addEventListener('resize', this.resizeCanvas);
    window.addEventListener('mousemove', (event) => {
      MOUSEPOS = {x: event.clientX, y: event.clientY};
    })
  }

  Play(){
      // pedimos que en el siguiente frame tambien llame a Play()
      // (es como el loop while(window.isOpen()))
      window.requestAnimationFrame(this.Play);
      
      if(this.LOADED){
        // Lo que se debe dibujar en el proximo frame
        // clear
        this.ctx.clearRect(0, 0, 400, 400);
        
        // update
        if(this.game){
          this.game.update();
          this.game.draw();
        }
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
        RSC.set(key,image)
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
    this.canvas.width = 400;
    this.canvas.height = 400;
  }

  // Botones
  loadConfig(){
    this.game.loadConfig();
  }

  saveConfig(){
    this.game.saveConfig();
  }

  saveAll(){
    this.game.saveAll();
  }

  shuffle(){
    this.game.shuffle();
  }
}