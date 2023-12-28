class Game{
    constructor(rsc, ctx, canvas){
        // Enlazar this's
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);

        this.rsc = rsc;
        this.ctx = ctx;
        this.canvas = canvas;

        this.tablero = new Tablero(this.rsc.get('tablero'), this.ctx, this.canvas);
    }
}

Object.assign(Game.prototype, Scene);

Game.prototype.update = function(){
    this.tablero.update();
    //this.piezas.forEach(pieza => {
    //    pieza.update();
    //});
};

Game.prototype.draw = function(){
    this.tablero.draw(this.ctx);
    //this.piezas.forEach(pieza => {
    //    pieza.draw(this.ctx);
    //});
}