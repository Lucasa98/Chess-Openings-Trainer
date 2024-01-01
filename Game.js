class Game{
    constructor(ctx, canvas, config){
        // Enlazar this's
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.click = this.click.bind(this);
        this.unclick = this.unclick.bind(this);
        this.Jaque = this.Jaque.bind(this);
        this.CalcularMovimientos = this.CalcularMovimientos.bind(this);
        this.EliminarPieza = this.EliminarPieza.bind(this);
        this.King = this.King.bind(this);

        this.ctx = ctx;
        this.canvas = canvas;

        this.initialConfig = config;

        this.marcas = [];   // Marcas en el tablero para indicar movimientos posibles.
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
        this.piezaSeleccionada = -1;
        this.rey = {b: -1, w: -1};  // indice para encontrar los reyes
        this.turno = true;

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
                if(this.initialConfig[i].tipo === 'kw'){
                    this.rey.w = i;
                }else if(this.initialConfig[i].tipo === 'kb'){
                    this.rey.b = i;
                }
            }
        }

        window.addEventListener('mousedown', this.click);
        window.addEventListener('mouseup', this.unclick);
    }

    click(event){
        // 1.1 - No hay pieza seleccionada
        if(this.piezaSeleccionada === -1){
            if(MOUSEPOS.x >= 0 && MOUSEPOS.y >= 0 && MOUSEPOS.x < 400 && MOUSEPOS.y < 400){
                // 2 - Detectar casilla
                var casilla = {x: MOUSEPOS.x/50, y: 7-MOUSEPOS.y/50};
                var i = this.tabPos[casilla.x][casilla.y];

                // 3.1 - La casilla esta ocupada por una pieza propia
                if(i != -1 && this.piezas[i].color == this.turno){
                    // 3.1.1 - Seleccionar pieza
                    this.piezaSeleccionada = i;
                    // 3.1.2 - Agarrar pieza
                    this.piezas[i].Drag();
                    // 3.1.3 - Calcular movimientos posibles para la pieza seleccionada
                    this.marcas = CalcularMovimientos(i);
                }
                // 3.2 - La casilla esta vacia u ocupada por pieza enemiga (no pasa nada)

            }
        }else{
        // 1.2 - SI hay pieza seleccionada
            // 1.2.1 - Detectar Casilla
            if(MOUSEPOS.x >= 0 && MOUSEPOS.y >= 0 && MOUSEPOS.x < 400 && MOUSEPOS.y < 400){
                var casilla = {x: MOUSEPOS.x/50, y: 7-MOUSEPOS.y/50};
                var i = this.tabPos[casilla.x][casilla.y];
                // 1.2.2.1 - La casilla no es un movimiento valido (Deseleccionar pieza)
                if(!this.marcas.includes({x: casilla.x, y: casilla.y})){
                    this.piezaSeleccionada = -1;
                    this.marcas = [];
                }else{
                // 1.2.2.2 - La casilla es un movimiento valido
                    // 1.2.2.2.1 - Eliminar pieza en la casilla destino (si hay)
                    if(this.tabPos[casilla.x][casilla.y] != -1){
                        this.EliminarPieza(i);
                        this.tabPos[casilla.x][casilla.y] = -1;
                    }
                    // 1.2.2.2.2 - Actualiza tabPos
                    this.tabPos[casilla.x][casilla.y] = this.piezaSeleccionada;     //casilla nueva
                    this.tabPos[this.piezaSeleccionada.casilla.x][this.piezaSeleccionada.casilla.y] = -1;   //casilla vieja
                    // 1.2.2.2.3 - Mover pieza
                    this.piezas[this.piezaSeleccionada].Drop(casilla);
                    // 1.2.2.2.4 - Deseleccionar pieza
                    this.piezaSeleccionada = -1;
                    this.marcas = [];
                    // 1.2.2.2.5 - Terminar turno
                    this.turno = !this.turno;
                }
            }else{
                // 1.2.2.1
                this.piezaSeleccionada = -1;
                this.marcas = [];
            }
        }
    }

    unclick(event){
        // 1.1 - Si no hay pieza seleccionada, no hacemos nada
        if(this.piezaSeleccionada != -1){
            // 1.2 - Si hay pieza seleccionada
            // 1.2.1 - Calcular casilla
            var casilla = {x: MOUSEPOS.x/50, y: 7-MOUSEPOS.y/50};
            var i = this.tabPos[casilla.x][casilla.y];
            // 1.2.2.1 - Si es un movimiento valido (se mueve y deseleccionamos)
            if(this.marcas.includes(casilla)){
                // 1.2.2.1.1 - Eliminar pieza en la casilla destino (si hay)
                if(this.tabPos[casilla.x][casilla.y] != -1){
                    this.EliminarPieza(i);
                    this.tabPos[casilla.x][casilla.y] = -1;
                }
                // 1.2.2.1.2 - Actualiza tabPos
                this.tabPos[casilla.x][casilla.y] = this.piezaSeleccionada;     //casilla nueva
                this.tabPos[this.piezaSeleccionada.casilla.x][this.piezaSeleccionada.casilla.y] = -1;   //casilla vieja
                // 1.2.2.1.3 - Mover pieza
                this.piezas[this.piezaSeleccionada].Drop(casilla);
                // 1.2.2.1.4 - Deseleccionar pieza
                this.piezaSeleccionada = -1;
                this.marcas = [];
                // 1.2.2.1.5 - Terminar turno
                this.turno = !this.turno;
            }else{
            // 1.2.2.2 - Si no es un movimiento valido (vuelve al origen)
                this.piezas[i].Drop();
            }
        }
    }

    Jaque(equipo,i,cas){
        /*
            Devuelve true si mover la pieza 'i' a la casilla 'cas' genera un jaque
            para 'equipo' (true: jaque de las blancas para las negras).
        */
        var myking = {};    // guarda la posicion del rey en este caso
        if(equipo)
            myking = {...this.piezas[this.rey.w].casilla};
        else
            myking = {...this.piezas[this.rey.b].casilla};

        if(this.piezas[i].tipo.charAt(0) === 'k')
            myking = cas;   // si la pieza que se mueve es el rey, cambia la cosa
        
        for(var j=0; j<this.piezas.length; ++j){
            if(equipo === (this.piezas[j].tipo.charAt(1) === 'w')){
                if(this.CalcularMovimientos(j,false,i,cas).includes(myking))
                    return true;
            }
        }
    }

    CalcularMovimientos(i,king,j,casilla){
        /*
            Calcula y devuelve una lista con las casillas a las que se puede mover la pieza
                ~ i: pieza que queremos ver los movimientos
                ~ king: indica si tener en cuenta al rey
                    ~ false: no se tiene en cuenta al rey (dejarlo en jaque o parecido)
                    ~ true: se descartan movimientos que dejan al rey en jaque.
                ~ j: (opcional) pieza a cambiar
                ~ casilla: (opcional) si se recibe, es la casilla en la que se debe considerar a j. Si no se recibe, se ignora a j.
        */
        var moves = [];
        var myTabPos = [...this.tabPos];    //copia de tabPos
        if(j){
            if(casilla){
                myTabPos[casilla.x][casilla.y] = j;
            }
            myTabPos[this.piezas[j].casilla.x][this.piezas[j].casilla.y] = -1;
        }

        // Todos los movimientos posible segun la pieza, su posiciones y las piezas propias.
        switch(this.piezas[i].tipo.charAt(0)){
            case 'k':
                moves = this.King(this.piezas[i].casilla);
                break;
            case 'p':
                moves = this.Pawn(this.piezas[i].casilla);
                break;
            case 'q':
                moves = this.Queen(this.piezas[i].casilla);
                break;
            case 'n':
                moves = this.Knight(this.piezas[i].casilla);
                break;
            case 'b':
                moves = this.Bishop(this.piezas[i].casilla);
                break;
            case 'r':
                moves = this.Rook(this.piezas[i].casilla);
                break;
        }

        // Descartar los no validos:
        //  ~ Dejan el rey en mate

        if(king){
            for(var k=0; k<moves.length; ++k){
                if(turno){
                    // "Si es jaque de las negras moviendo la pieza i a la casilla moves[i]"
                    if(Jaque(false,i,moves[i])){
                        moves.splice(k,1);
                        k -= 1;
                    }
                }else{
                    // "Si es jaque de las blancas moviendo la pieza i a la casilla moves[i]"
                    if(Jaque(true,i,moves[i])){
                        moves.splice(k,1);
                        k -= 1;
                    }
                }
            }
        }

        return moves;
    }

    EliminarPieza(i){
        // Debemos eliminar la pieza del arreglo y ademas actualizar los indices en tabPos y piezaSeleccionada
        this.piezas.splice(i,1);    // eliminamos
        for(var x=0; x<8; ++x){
            for(var y=0; y<8; ++y){
                if(this.tabPos[x][y] > i){  //correjimos los indices en tabPos
                    this.tabPos[x][y] -= 1;
                }
            }
        }
        if(this.piezaSeleccionada > i){     //correjimos piezaSeleccionada
            this.piezaSeleccionada -= 1;
        }
        if(this.rey.w > i){                //correjimos king.w
            this.piezaSeleccionada -= 1;
        }
        if(this.rey.b > i){                //correjimos king.b
            this.piezaSeleccionada -= 1;
        }
    }

    King(cas){
        var moves = [];
        if(cas.x === 0){
            if(cas.y === 0){
                // esquina superior izquierda
                // aca deberia verificar: que no este ocupada y que no esté amenazada (en el caso del rey)
                if(this.piezas[this.tabPos[cas.x+1][cas.y]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x+1,cas.y);      // E
                if(this.piezas[this.tabPos[cas.x][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x,cas.y+1);      // S
                if(this.piezas[this.tabPos[cas.x+1][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x+1,cas.y+1);    // SE
            }else if(cas.y === 7){
                //  esquina inferior izquierda
                if(this.piezas[this.tabPos[cas.x+1][cas.y]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x+1,cas.y);      // E
                if(this.piezas[this.tabPos[cas.x][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x,cas.y-1);      // N
                if(this.piezas[this.tabPos[cas.x+1][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x+1,cas.y-1);    // NE
            }else{
                // lateral izquierdo
                if(this.piezas[this.tabPos[cas.x][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x,cas.y-1);      // N
                if(this.piezas[this.tabPos[cas.x+1][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x+1,cas.y-1);    // NE
                if(this.piezas[this.tabPos[cas.x+1][cas.y]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x+1,cas.y);      // E
                if(this.piezas[this.tabPos[cas.x+1][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x+1,cas.y+1);    // SE
                if(this.piezas[this.tabPos[cas.x][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x,cas.y+1);      // S
            }
        }else if(cas.x === 7){
            if(cas.y === 0){
                // esquina superior derecha
                // aca deberia verificar: que no este ocupada y que no esté amenazada (en el caso del rey)
                if(this.piezas[this.tabPos[cas.x-1][cas.y]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x-1,cas.y);      // O
                if(this.piezas[this.tabPos[cas.x][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x,cas.y+1);      // S
                if(this.piezas[this.tabPos[cas.x-1][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x-1,cas.y+1);    // SO
            }else if(cas.y === 7){
                //  esquina inferior derecha
                if(this.piezas[this.tabPos[cas.x-1][cas.y]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x-1,cas.y);      // O
                if(this.piezas[this.tabPos[cas.x][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x,cas.y-1);      // N
                if(this.piezas[this.tabPos[cas.x-1][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x-1,cas.y-1);    // NO
            }else{
                // lateral derecho
                if(this.piezas[this.tabPos[cas.x][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x,cas.y-1);      // N
                if(this.piezas[this.tabPos[cas.x-1][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x-1,cas.y-1);    // NO
                if(this.piezas[this.tabPos[cas.x-1][cas.y]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x-1,cas.y);      // O
                if(this.piezas[this.tabPos[cas.x-1][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x-1,cas.y+1);    // SO
                if(this.piezas[this.tabPos[cas.x][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                    moves.push(cas.x,cas.y+1);      // S
            }
        }else{
            // todo
            if(this.piezas[this.tabPos[cas.x-1][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                moves.push(cas.x-1,cas.y-1);    // NO
            if(this.piezas[this.tabPos[cas.x][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                moves.push(cas.x,cas.y-1);      // N
            if(this.piezas[this.tabPos[cas.x+1][cas.y-1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                moves.push(cas.x+1,cas.y-1);    // NE
            if(this.piezas[this.tabPos[cas.x+1][cas.y]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                moves.push(cas.x+1,cas.y);      // E
            if(this.piezas[this.tabPos[cas.x+1][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                moves.push(cas.x+1,cas.y+1);    // SE
            if(this.piezas[this.tabPos[cas.x][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                moves.push(cas.x,cas.y+1);      // S
            if(this.piezas[this.tabPos[cas.x-1][cas.y+1]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                moves.push(cas.x-1,cas.y+1);    // SO
            if(this.piezas[this.tabPos[cas.x-1][cas.y]].tipo != this.piezas[this.tabPos[cas.x][cas.y]])
                moves.push(cas.x-1,cas.y);      // O
        }

        return moves;
    }

    update(){
        this.piezaSeleccionada = this.piezaSeleccionada;
    }

    draw(){
        this.ctx.drawImage(RSC.get('tablero'), 0, 0);
        for(var i=0; i<this.piezas.length; ++i){
            this.piezas[i].Draw();
        }
        for(var i=0; i<this.marcas.length; ++i){
            this.ctx.drawImage(RSC.get('marca'), marcas[i].x, marcas[i].y);
        } 
    }
}