class Game{

}

Object.assign(Game.prototype, Scene);

Game.prototype.update = function(){
    this.tablero.update();
    this.piezas.forEach(pieza => {
        pieza.update();
    });
};

Game.prototype.draw = function(){
    this.tablero.draw(this.ctx);
    this.piezas.forEach(pieza => {
        pieza.draw(this.ctx);
    });
}