class Menu{
    // to-do: agregar constructor, listeners,
    constructor(rsc){
        this.rsc = rsc;
        this.playButton = new button('Play');
        
    }

    update = function(){
        this.tablero.update();
        this.piezas.forEach(pieza => {
            pieza.update();
        });
    };
    
    draw = function(){
        this.tablero.draw(this.ctx);
        this.piezas.forEach(pieza => {
            pieza.draw(this.ctx);
        });
    }
}