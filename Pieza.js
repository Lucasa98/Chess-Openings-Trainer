/* Esta clase se encarga de:
        ~ Guardar el tipo de la pieza (peon, caballo, etc.).
        ~ Guardar el color de la pieza.
        ~ Guardar la posicion de la pieza:
            ~ Posicion discreta (casilla del tablero)
            ~ Posicion continua (pixel de la pantalla, pos del mouse cuando es arrastrada).
        ~ Guardar y dibujar el sprite.
    No se encarga de la lógica del juego (comer pieza, dónde puede moverse, etc.).
*/

class Pieza{
    constructor(ctx, canvas, tipo, color, x, y){
        // Enlazar this's
        this.draw = this.Draw.bind(this);

        this.ctx = ctx;
        this.canvas = canvas;

        this.tipo = tipo;
        this.color = color;
        this.casilla = {x: x, y: y};
        this.pos = {x: x*50, y: 350-y*50};

        this.drag = false;
        this.img = RSC.get(this.tipo);
    }

    Draw(){
        if(this.dragged)
            this.pos = {x: MOUSEPOS.x-25, y: MOUSEPOS.y-25};
        this.ctx.drawImage(this.img, this.pos.x, this.pos.y);
    }

    Drag(){
        this.dragged = true;
    }

    Drop(cas){
        this.casilla = {x: cas.x, y: cas.y};
        this.pos = {x: cas.x*50, y: 350-cas.y*50};
        this.dragged = false;
    }
}