class Menu{
    // to-do: agregar constructor, listeners,
    constructor(rsc){
        this.rsc = rsc;
        this.playButton = new button('Play');
        
    }

}

Object.assign(Menu.prototype, Scene);

Menu.prototype.update = function(){
    this.tablero.update();
    this.piezas.forEach(pieza => {
        pieza.update();
    });
};

Menu.prototype.draw = function(){
    this.tablero.draw(this.ctx);
    this.piezas.forEach(pieza => {
        pieza.draw(this.ctx);
    });
}