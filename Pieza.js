class Pieza{
    constructor(ctx, canvas, tipo, color, x, y){
        // Enlazar this's
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);

        this.ctx = ctx;
        this.canvas = canvas;

        this.tipo = tipo;
        this.color = color;
        this.x = x*50;
        this.y = 350 - y*50;

        this.originalPos = {x: this.x, y: this.y};
        this.drag = false;
        this.img = RSC.get(this.tipo);
    }

    update(){
        if(this.drag){
            this.x = MOUSEPOS.x-25;
            this.y = MOUSEPOS.y-25;
        }
    }

    draw(){
        if(this.img){
            this.ctx.drawImage(this.img, this.x, this.y);
        }else{
            console.error('img not loaded');
        }
    }

    Drag(){
        this.originalPos = {x: this.x, y: this.y};
        this.drag = true;
    }

    Drop(){
        this.drag = false;
    }

    Return(){
        this.x = this.originalPos.x;
        this.y = this.originalPos.y;
    }

    fix(x,y){
        this.x = x;
        this.y = y;
        this.originalPos = {x: this.x, y: this.y};
    }
}