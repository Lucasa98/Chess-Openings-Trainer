class Game{
    constructor(ctx, canvas, config){
        // Enlazar this's
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.click = this.click.bind(this);
        this.unclick = this.unclick.bind(this);

        this.ctx = ctx;
        this.canvas = canvas;

        this.tablero = new Tablero(this.ctx, this.canvas);
        this.initialConfig = config;

        this.piezas = [];
        // Esta matriz de tamanio fijo representa las posiciones del tablero.
        // En la posicion (x,y) de la matriz se encuentra el índice de la pieza (en el vector piezas)
        // que ocupa esa posicion. En caso de que no este ocupada, almacena -1;
        // Nota: x=0 es a, x=1 es b, etc. y=0 es 1, y=1 es 2, etc.
        this.tabPos = [ [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],];
        
        // variable que guarda qué pieza esta siendo "agarrada". -1 si ninguna.
        this.pieceDragged = -1;

        for(var i=0; i<this.initialConfig.length; ++i){
            // Verificacion de que la configuración está bien y que la casilla no está ocupada.
            if(this.tabPos[this.initialConfig[i].x][this.initialConfig[i].y] != -1){
                console.error('CONFIGERROR: casilla ocupada\n'
                            + '>>> ' + String.fromCharCode('a'.charCodeAt()+this.initialConfig[i].x)
                            + (this.initialConfig[i].y+1)
                            + ' ocupada por ' + this.piezas[this.tabPos[this.initialConfig[i].x][this.initialConfig[i].y]].tipo );
            }else{
                this.tabPos[this.initialConfig[i].x][this.initialConfig[i].y] = this.piezas.length;
                this.piezas.push(new Pieza(this.ctx, this.canvas, this.initialConfig[i].tipo, this.initialConfig[i].color, this.initialConfig[i].x, this.initialConfig[i].y));
            }
        }

        window.addEventListener('mousedown', this.click);
        window.addEventListener('mouseup', this.unclick);
    }

    click(event){
        if(event.clientX > 0 && event.clientX < 400){
            if(event.clientY > 0 && event.clientY < 400){
                // click en el tablero
                // detectar casilla
                var casX = Math.floor(event.clientX/50);
                var casY = 7-Math.floor(event.clientY/50);
                var i = this.tabPos[casX][casY];
                console.log(`(${casX}, ${casY}) = ${i}`);
                if(i != -1){
                    this.pieceDragged = i;
                    this.pieceOrigin = {x: casX, y: casY};
                    this.piezas[i].Drag();
                }
            }
        }
    }

    unclick(event){
        if(this.pieceDragged != -1){
            this.piezas[this.pieceDragged].Drop();
            if(event.clientX > 400 || event.clientY > 400){
                this.piezas[this.pieceDragged].Return();
                this.pieceDragged = -1;
            }else{
                var casX = Math.floor(event.clientX/50);
                var casY = 7-Math.floor(event.clientY/50);
                if(this.tabPos[casX][casY] != -1){
                    // casilla ocupada
                    this.piezas[this.pieceDragged].Return();
                }else{
                    // MOVIMIENTO DE PIEZA
                    var origX = this.pieceOrigin.x;
                    var origY = this.pieceOrigin.y;

                    //
                    this.tabPos[origX][origY] = -1;
                    this.tabPos[casX][casY] = this.pieceDragged;
                    this.piezas[this.pieceDragged].fix(casX*50,350-casY*50);
                    console.log(`origPos (${origX},${origY}) = ${this.tabPos[origX][origY]} \n`
                                + `newpos (${casX}, ${casY}) = ${this.tabPos[casX][casY]}`);
                }
            }
        }
        this.pieceDragged = -1;
        //if(event.clientX > 0 && event.clientX < 400){
        //    if(event.clientY > 0 && event.clientY < 400){
//
        //    }
        //}
    }
}

Object.assign(Game.prototype, Scene);

Game.prototype.update = function(){
    this.tablero.update();
    for(var i=0; i<this.piezas.length; ++i){
        this.piezas[i].update();
    }
};

Game.prototype.draw = function(){
    this.tablero.draw();
    for(var i=0; i<this.piezas.length; ++i){
        this.piezas[i].draw();
    }
}