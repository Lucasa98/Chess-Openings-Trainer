class Ajedrez{
    constructor(){
        // Canvas que contiene todo el espacio de dibujo
        this.canvas = document.getElementById("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.heigth = window.innerHeight;

        // Context
        this.ctx = this.canvas.getContext('2d');

        // Listeners
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        })
    }

    Play(){
        this.scene = new Menu();
        while(true){
            this.scene.ProcessEvents(this.canvas);
        }
    }

    resizeCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.heigth = window.innerHeight;
    }
}