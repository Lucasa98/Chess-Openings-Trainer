class Tablero{
    constructor(ctx, canvas){
        // Enlazar this's
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);

        this.img = RSC.get('tablero');
        this.ctx = ctx;
        this.canvas = canvas;
    }

    update(){

    }

    draw(){
        if(this.img){
            this.ctx.drawImage(this.img, 0, 0);
        }else{
            console.error('img not loaded');
        }
    }
}