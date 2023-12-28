class Tablero{
    constructor(img, ctx, canvas){
        // Enlazar this's
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);

        this.img = img;
        this.ctx = ctx;
        this.canvas = canvas;
    }

    update(canvas){

    }

    draw(ctx){
        if(this.img){
            this.ctx.drawImage(this.img, 0, 0);
        }else{
            console.error('img not loaded');
        }
    }
}