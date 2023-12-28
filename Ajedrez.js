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

    // Listeners ( ProcessEvents )
    resizeCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.heigth = window.innerHeight;
    }
}