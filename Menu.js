class Menu{
    // to-do: agregar constructor, listeners, 
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