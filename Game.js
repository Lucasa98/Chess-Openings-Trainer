class Game{
    constructor(ctx, canvas){
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

        this.config = [];
        this.loadConfigs();
        this.initialConfig = [new ChessElement('kw',true,4,0),
                            new ChessElement('kb',false,4,7),
                            new ChessElement('qw',true,3,0),
                            new ChessElement('qb',false,3,7),
                            new ChessElement('nw',true,1,0),
                            new ChessElement('nw',true,6,0),
                            new ChessElement('nb',false,1,7),
                            new ChessElement('nb',false,6,7),
                            new ChessElement('bw',true,5,0),
                            new ChessElement('bw',true,2,0),
                            new ChessElement('bb',false,2,7),
                            new ChessElement('bb',false,5,7),
                            new ChessElement('rw',true,0,0),
                            new ChessElement('rw',true,7,0),
                            new ChessElement('rb',false,0,7),
                            new ChessElement('rb',false,7,7),
                            new ChessElement('pw',true,0,1),
                            new ChessElement('pw',true,1,1),
                            new ChessElement('pw',true,2,1),
                            new ChessElement('pw',true,3,1),
                            new ChessElement('pw',true,4,1),
                            new ChessElement('pw',true,5,1),
                            new ChessElement('pw',true,6,1),
                            new ChessElement('pw',true,7,1),
                            new ChessElement('pb',false,0,6),
                            new ChessElement('pb',false,1,6),
                            new ChessElement('pb',false,2,6),
                            new ChessElement('pb',false,3,6),
                            new ChessElement('pb',false,4,6),
                            new ChessElement('pb',false,5,6),
                            new ChessElement('pb',false,6,6),
                            new ChessElement('pb',false,7,6)];

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

        this.LoadInitialConfig();

        window.addEventListener('mousedown', this.click);
        window.addEventListener('mouseup', this.unclick);

    }

    click(event){
        // 1.1 - No hay pieza seleccionada
        if(this.piezaSeleccionada === -1){
            if(MOUSEPOS.x >= 0 && MOUSEPOS.y >= 0 && MOUSEPOS.x < 400 && MOUSEPOS.y < 400){
                // 2 - Detectar casilla
                var casilla = {x: Math.floor(MOUSEPOS.x/50), y: 7-Math.floor(MOUSEPOS.y/50)};
                var i = JSON.parse(JSON.stringify(this.tabPos[casilla.x][casilla.y]));

                // 3.1 - La casilla esta ocupada por una pieza propia
                if(i != -1 && this.piezas[i].color == this.turno){
                    // 3.1.1 - Seleccionar pieza
                    this.piezaSeleccionada = JSON.parse(JSON.stringify(i));
                    // 3.1.2 - Agarrar pieza
                    this.piezas[i].Drag();
                    // 3.1.3 - Calcular movimientos posibles para la pieza seleccionada
                    this.marcas = this.CalcularMovimientos(i, true);
                }
                // 3.2 - La casilla esta vacia u ocupada por pieza enemiga (no pasa nada)

            }
        }else{
        // 1.2 - SI hay pieza seleccionada
            // 1.2.1 - Detectar Casilla
            if(MOUSEPOS.x >= 0 && MOUSEPOS.y >= 0 && MOUSEPOS.x < 400 && MOUSEPOS.y < 400){
                var casilla = {x: Math.floor(MOUSEPOS.x/50), y: 7-Math.floor(MOUSEPOS.y/50)};
                var i = this.tabPos[casilla.x][casilla.y];
                // 1.2.2.1 - La casilla no es un movimiento valido
                if(!this.marcas.some(obj=>obj.x == casilla.x && obj.y == casilla.y)){
                    // 1.2.2.1.1 - La casilla no es la casilla de la pieza (deseleccionar)
                    if(this.piezas[this.piezaSeleccionada].casilla.x != casilla.x || this.piezas[this.piezaSeleccionada].casilla.y != casilla.y){
                        this.piezaSeleccionada = -1;
                        this.marcas = [];
                    }else{
                        // 1.2.2.1.2 - La casilla es la casilla de la pieza (arrastrar)
                        this.piezas[i].Drag();
                    }
                }else{
                // 1.2.2.2 - La casilla es un movimiento valido
                    // 1.2.2.2.1 - Eliminar pieza en la casilla destino (si hay)
                    if(this.tabPos[casilla.x][casilla.y] != -1){
                        this.EliminarPieza(i);
                        this.tabPos[casilla.x][casilla.y] = -1;
                    }
                    // 1.2.2.2.2 - Actualiza tabPos
                    this.tabPos[casilla.x][casilla.y] = JSON.parse(JSON.stringify(this.piezaSeleccionada));     //casilla nueva
                    this.tabPos[this.piezas[this.piezaSeleccionada].casilla.x][this.piezas[this.piezaSeleccionada].casilla.y] = -1;   //casilla vieja

                    // 1.2.2.2.3 - Mover pieza
                    this.config.push({i: {x: this.piezas[this.piezaSeleccionada].casilla.x, y: this.piezas[this.piezaSeleccionada].casilla.y},
                                      f: {x: casilla.x, y: casilla.y}});
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
            if(MOUSEPOS.x >= 0 && MOUSEPOS.y >= 0 && MOUSEPOS.x < 400 && MOUSEPOS.y < 400){
                // 1.2.1 - Calcular casilla
                var casilla = {x: Math.floor(MOUSEPOS.x/50), y: 7-Math.floor(MOUSEPOS.y/50)};
                var i = this.tabPos[casilla.x][casilla.y];
                // 1.2.2.1 - Si es un movimiento valido (se mueve y deseleccionamos)
                if(this.marcas.some(obj=>obj.x === casilla.x && obj.y === casilla.y)){
                    // 1.2.2.1.1 - Eliminar pieza en la casilla destino (si hay)
                    if(this.tabPos[casilla.x][casilla.y] != -1){
                        this.EliminarPieza(i);
                        this.tabPos[casilla.x][casilla.y] = -1;
                    }
                    // 1.2.2.1.2 - Actualiza tabPos
                    this.tabPos[casilla.x][casilla.y] = JSON.parse(JSON.stringify(this.piezaSeleccionada));     //casilla nueva
                    this.tabPos[this.piezas[this.piezaSeleccionada].casilla.x][this.piezas[this.piezaSeleccionada].casilla.y] = -1;   //casilla vieja
                    // 1.2.2.1.3 - Mover pieza
                    this.piezas[this.piezaSeleccionada].Drop(casilla);
                    // 1.2.2.1.4 - Deseleccionar pieza
                    this.piezaSeleccionada = -1;
                    this.marcas = [];
                    // 1.2.2.1.5 - Terminar turno
                    this.turno = !this.turno;
                }else{
                // 1.2.2.2 - Si no es un movimiento valido (vuelve al origen)
                    this.piezas[this.piezaSeleccionada].Drop(this.piezas[this.piezaSeleccionada].casilla);
                }
            }else{
                this.piezas[this.piezaSeleccionada].Drop(this.piezas[this.piezaSeleccionada].casilla);
            }
        }
    }

    Jaque(equipo,i,cas){
        /*
            Devuelve true si mover la pieza 'i' a la casilla 'cas' genera un jaque
            para 'equipo' (true: jaque de las blancas para las negras).
        */
        
        var myking = {};    // guarda la posicion del rey en este caso
        if(!equipo)
            myking = {...this.piezas[this.rey.w].casilla};
        else
            myking = {...this.piezas[this.rey.b].casilla};
        
            
        if(this.piezas[i].tipo.charAt(0) === 'k')
            myking = cas;   // si la pieza que se mueve es el rey, cambia la cosa
        
        for(var j=0; j<this.piezas.length; ++j){
            if(equipo == (this.piezas[j].tipo.charAt(1) == 'w') && (this.piezas[j].casilla.x != cas.x || this.piezas[j].casilla.y != cas.y)){
                if(this.CalcularMovimientos(j,false,i,cas).some(obj=>obj.x == myking.x && obj.y == myking.y)){
                    return true;
                }
            }
        }
        return false;
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
        var myTabPos = JSON.parse(JSON.stringify(this.tabPos));    //copia de tabPos
        if(j != undefined){
            if(casilla){
                myTabPos[casilla.x][casilla.y] = j;
            }
            myTabPos[this.piezas[j].casilla.x][this.piezas[j].casilla.y] = -1;
        }

        // Todos los movimientos posible segun la pieza, su posiciones y las piezas propias.
        switch(this.piezas[i].tipo.charAt(0)){
            case 'k':
                moves = this.King(this.piezas[i].casilla, myTabPos);
                break;
            case 'p':
                moves = this.Pawn(this.piezas[i].casilla, myTabPos);
                break;
            case 'q':
                moves = this.Queen(this.piezas[i].casilla, myTabPos);
                break;
            case 'n':
                moves = this.Knight(this.piezas[i].casilla, myTabPos);
                break;
            case 'b':
                moves = this.Bishop(this.piezas[i].casilla, myTabPos);
                break;
            case 'r':
                moves = this.Rook(this.piezas[i].casilla, myTabPos);
                break;
        }

        // Descartar los no validos:
        //  ~ Dejan el rey en mate
        if(king){
            for(var k=0; k<moves.length; ++k){
                if(this.turno){
                    // "Si es jaque de las negras moviendo la pieza i a la casilla moves[k]"
                    if(moves[k].x == 3 && moves[k].y == 7)
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!");            // -----DEBUG-----
                    if(this.Jaque(false,i,moves[k])){
                        if(moves[k].x == 3 && moves[k].y == 7)
                            console.log("el hdp lo elimina");               // -----DEBUG-----
                        moves.splice(k,1);
                        k -= 1;
                    }
                }else{
                    // "Si es jaque de las blancas moviendo la pieza i a la casilla moves[k]"
                    if(this.Jaque(true,i,moves[k])){
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
            this.rey.w -= 1;
        }
        if(this.rey.b > i){                //correjimos king.b
            this.rey.b -= 1;
        }
    }

    King(cas, myTabPos){
        var moves = [];
        if(cas.x === 0){
            if(cas.y === 0){
                // esquina inferior izquierda
                // aca deberia verificar: que no este ocupada y que no esté amenazada (en el caso del rey)
                if(myTabPos[cas.x+1][cas.y] == -1 || this.piezas[myTabPos[cas.x+1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x+1, y: cas.y});      // E
                if(myTabPos[cas.x][cas.y+1] == -1 || this.piezas[myTabPos[cas.x][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y+1});      // N
                if(myTabPos[cas.x+1][cas.y+1] == -1 || this.piezas[myTabPos[cas.x+1][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y+1});    // NE
            }else if(cas.y === 7){
                //  esquina superior izquierda
                if(myTabPos[cas.x+1][cas.y] == -1 || this.piezas[myTabPos[cas.x+1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y});      // E
                if(myTabPos[cas.x][cas.y-1] == -1 || this.piezas[myTabPos[cas.x][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y-1});      // S
                if(myTabPos[cas.x+1][cas.y-1] == -1 || this.piezas[myTabPos[cas.x+1][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y-1});    // SE
            }else{
                // lateral izquierdo
                if(myTabPos[cas.x][cas.y-1] == -1 || this.piezas[myTabPos[cas.x][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y-1});      // S
                if(myTabPos[cas.x+1][cas.y-1] == -1 || this.piezas[myTabPos[cas.x+1][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y-1});    // SE
                if(myTabPos[cas.x+1][cas.y] == -1 || this.piezas[myTabPos[cas.x+1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y});      // E
                if(myTabPos[cas.x+1][cas.y+1] == -1 || this.piezas[myTabPos[cas.x+1][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y+1});    // NE
                if(myTabPos[cas.x][cas.y+1] == -1 || this.piezas[myTabPos[cas.x][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y+1});      // N
            }
        }else if(cas.x === 7){
            if(cas.y === 0){
                // esquina inferior derecha
                // aca deberia verificar: que no este ocupada y que no esté amenazada (en el caso del rey)
                if(myTabPos[cas.x-1][cas.y] == -1 || this.piezas[myTabPos[cas.x-1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y});      // O
                if(myTabPos[cas.x][cas.y+1] == -1 || this.piezas[myTabPos[cas.x][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y+1});      // N
                if(myTabPos[cas.x-1][cas.y+1] == -1 || this.piezas[myTabPos[cas.x-1][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y+1});    // NO
            }else if(cas.y === 7){
                //  esquina superior derecha
                if(myTabPos[cas.x-1][cas.y] == -1 || this.piezas[myTabPos[cas.x-1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y});      // O
                if(myTabPos[cas.x][cas.y-1] == -1 || this.piezas[myTabPos[cas.x][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y-1});      // S
                if(myTabPos[cas.x-1][cas.y-1] == -1 || this.piezas[myTabPos[cas.x-1][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y-1});    // SO
            }else{
                // lateral derecho
                if(myTabPos[cas.x][cas.y-1] == -1 || this.piezas[myTabPos[cas.x][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y-1});      // S
                if(myTabPos[cas.x-1][cas.y-1] == -1 || this.piezas[myTabPos[cas.x-1][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y-1});    // SO
                if(myTabPos[cas.x-1][cas.y] == -1 || this.piezas[myTabPos[cas.x-1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y});      // O
                if(myTabPos[cas.x-1][cas.y+1] == -1 || this.piezas[myTabPos[cas.x-1][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y+1});    // NO
                if(myTabPos[cas.x][cas.y+1] == -1 || this.piezas[myTabPos[cas.x][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y+1});      // N
            }
        }else{
            if(cas.y === 0){
                // borde inferior
                if(myTabPos[cas.x-1][cas.y] == -1 || this.piezas[myTabPos[cas.x-1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y});    // O
                if(myTabPos[cas.x-1][cas.y+1] == -1 || this.piezas[myTabPos[cas.x-1][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y+1});  // NO
                if(myTabPos[cas.x][cas.y+1] == -1 || this.piezas[myTabPos[cas.x][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y+1});    // N
                if(myTabPos[cas.x+1][cas.y+1] == -1 || this.piezas[myTabPos[cas.x+1][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y+1});  // NE
                if(myTabPos[cas.x+1][cas.y] == -1 || this.piezas[myTabPos[cas.x+1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y});    // E
            }else if(cas.y === 7){
                // borde superior
                if(myTabPos[cas.x-1][cas.y] == -1 || this.piezas[myTabPos[cas.x-1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y});    // O
                if(myTabPos[cas.x-1][cas.y-1] == -1 || this.piezas[myTabPos[cas.x-1][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y-1});  // SO
                if(myTabPos[cas.x][cas.y-1] == -1 || this.piezas[myTabPos[cas.x][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y-1});    // S
                if(myTabPos[cas.x+1][cas.y-1] == -1 || this.piezas[myTabPos[cas.x+1][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y-1});  // SE
                if(myTabPos[cas.x+1][cas.y] == -1 || this.piezas[myTabPos[cas.x+1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y});    // E
            }else{
                // todo
                if(myTabPos[cas.x-1][cas.y-1] == -1 || this.piezas[myTabPos[cas.x-1][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y-1});    // SO
                if(myTabPos[cas.x][cas.y-1] == -1 || this.piezas[myTabPos[cas.x][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y-1});      // S
                if(myTabPos[cas.x+1][cas.y-1] == -1 || this.piezas[myTabPos[cas.x+1][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y-1});    // SE
                if(myTabPos[cas.x+1][cas.y] == -1 || this.piezas[myTabPos[cas.x+1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y});      // E
                if(myTabPos[cas.x+1][cas.y+1] == -1 || this.piezas[myTabPos[cas.x+1][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x+1,y:cas.y+1});    // NE
                if(myTabPos[cas.x][cas.y+1] == -1 || this.piezas[myTabPos[cas.x][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x,y:cas.y+1});      // N
                if(myTabPos[cas.x-1][cas.y+1] == -1 || this.piezas[myTabPos[cas.x-1][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y+1});    // NO
                if(myTabPos[cas.x-1][cas.y] == -1 || this.piezas[myTabPos[cas.x-1][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x:cas.x-1,y:cas.y});      // O
            }
        }
        return moves;
    }

    Pawn(cas, myTabPos){
        var moves = [];
        if(this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1) == 'w'){
            // Peon blanco
            if(cas.y < 7){
                // adelante
                if(myTabPos[cas.x][cas.y+1] == -1){
                    moves.push({x: cas.x, y: cas.y+1});
                    if(cas.y == 1 && myTabPos[cas.x][cas.y+2] == -1)
                        moves.push({x: cas.x, y: cas.y+2});
                }
                // diagonales
                if(cas.x > 0 && myTabPos[cas.x-1][cas.y+1] != -1 && this.piezas[myTabPos[cas.x-1][cas.y+1]].tipo.charAt(1) == 'b')
                    moves.push({x: cas.x-1, y: cas.y+1});
                if(cas.x < 7 && myTabPos[cas.x+1][cas.y+1] != -1 && this.piezas[myTabPos[cas.x+1][cas.y+1]].tipo.charAt(1) == 'b')
                    moves.push({x: cas.x+1, y: cas.y+1});
            }
        }else{
            // Peon negro
            if(cas.y > 0){
                // adelante
                if(myTabPos[cas.x][cas.y-1] == -1){
                    moves.push({x: cas.x, y: cas.y-1});
                    if(cas.y == 6 && myTabPos[cas.x][cas.y-2] == -1)
                        moves.push({x: cas.x, y: cas.y-2});
                }
                // diagonales
                if(cas.x > 0 && myTabPos[cas.x-1][cas.y-1] != -1 && this.piezas[myTabPos[cas.x-1][cas.y-1]].tipo.charAt(1) == 'w')
                    moves.push({x: cas.x-1, y: cas.y-1});
                if(cas.x < 7 && myTabPos[cas.x+1][cas.y-1] != -1 && this.piezas[myTabPos[cas.x+1][cas.y-1]].tipo.charAt(1) == 'w')
                    moves.push({x: cas.x+1, y: cas.y-1});
            }
        }
        return moves;
    }

    Queen(cas, myTabPos){
        var moves = [];

        // N
        var i = 1;
        while(cas.y+i < 8){
            // 1 - casilla vacia
            if(myTabPos[cas.x][cas.y+i] == -1){
                moves.push({x: cas.x, y: cas.y+i});
            }else{
            // 2 - casilla ocupada
                // 2.1 - pieza propia
                if(this.piezas[myTabPos[cas.x][cas.y+i]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)){
                // 2.2 - pieza contraria
                    moves.push({x: cas.x, y: cas.y+i});
                }
                break;
            }
            ++i;
        }
        // NE
        i = 1;
        while(cas.x+i < 8 && cas.y+i < 8){
            // 1 - casilla vacia
            if(myTabPos[cas.x+i][cas.y+i] == -1){
                moves.push({x: cas.x+i, y: cas.y+i});
            }else{
            // 2 - casilla ocupada
                // 2.1 - pieza propia
                if(this.piezas[myTabPos[cas.x+i][cas.y+i]].tipo.charAt(1) == this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)){
                    break;
                }else{
                // 2.2 - pieza contraria
                    moves.push({x: cas.x+i, y: cas.y+i});
                    break;
                }
            }
            ++i;
        }
        // S
        i = 1;
        while(cas.y-i >= 0){
            // 1 - casilla vacia
            if(myTabPos[cas.x][cas.y-i] == -1){
                moves.push({x: cas.x, y: cas.y-i});
            }else{
            // 2 - casilla ocupada
                // 2.1 - pieza propia
                if(this.piezas[myTabPos[cas.x][cas.y-i]].tipo.charAt(1) == this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)){
                    break;
                }else{
                // 2.2 - pieza contraria
                    moves.push({x: cas.x, y: cas.y-i});
                    break;
                }
            }
            ++i;
        }
        // SE
        i = 1;
        while(cas.x+i < 8 && cas.y-i >= 0){
            // 1 - casilla vacia
            if(myTabPos[cas.x+i][cas.y-i] == -1){
                moves.push({x: cas.x+i, y: cas.y-i});
            }else{
            // 2 - casilla ocupada
                // 2.1 - pieza propia
                if(this.piezas[myTabPos[cas.x+i][cas.y-i]].tipo.charAt(1) == this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)){
                    break;
                }else{
                // 2.2 - pieza contraria
                    moves.push({x: cas.x+i, y: cas.y-i});
                    break;
                }
            }
            ++i;
        }
        // E
        i = 1;
        while(cas.x+i < 8){
            // 1 - casilla vacia
            if(myTabPos[cas.x+i][cas.y] == -1){
                moves.push({x: cas.x+i, y: cas.y});
            }else{
            // 2 - casilla ocupada
                // 2.1 - pieza propia
                if(this.piezas[myTabPos[cas.x+i][cas.y]].tipo.charAt(1) == this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)){
                    break;
                }else{
                // 2.2 - pieza contraria
                    moves.push({x: cas.x+i, y: cas.y});
                    break;
                }
            }
            ++i;
        }
        // NO
        i = 1;
        while(cas.x-i >= 0 && cas.y+i < 8){
            // 1 - casilla vacia
            if(myTabPos[cas.x-i][cas.y+i] == -1){
                moves.push({x: cas.x-i, y: cas.y+i});
            }else{
            // 2 - casilla ocupada
                // 2.1 - pieza propia
                if(this.piezas[myTabPos[cas.x-i][cas.y+i]].tipo.charAt(1) == this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)){
                    break;
                }else{
                // 2.2 - pieza contraria
                    moves.push({x: cas.x-i, y: cas.y+i});
                    break;
                }
            }
            ++i;
        }
        // SO
        i = 1;
        while(cas.x-i >= 0 && cas.y-i >= 0){
            // 1 - casilla vacia
            if(myTabPos[cas.x-i][cas.y-i] == -1){
                moves.push({x: cas.x-i, y: cas.y-i});
            }else{
            // 2 - casilla ocupada
                // 2.1 - pieza propia
                if(this.piezas[myTabPos[cas.x-i][cas.y-i]].tipo.charAt(1) == this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)){
                    break;
                }else{
                // 2.2 - pieza contraria
                    moves.push({x: cas.x-i, y: cas.y-i});
                    break;
                }
            }
            ++i;
        }
        // O
        i = 1;
        while(cas.x-i >= 0){
            // 1 - casilla vacia
            if(myTabPos[cas.x-i][cas.y] == -1){
                moves.push({x: cas.x-i, y: cas.y});
            }else{
            // 2 - casilla ocupada
                // 2.1 - pieza propia
                if(this.piezas[myTabPos[cas.x-i][cas.y]].tipo.charAt(1) == this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)){
                    break;
                }else{
                // 2.2 - pieza contraria
                    moves.push({x: cas.x-i, y: cas.y});
                    break;
                }
            }
            ++i;
        }

        return moves;
    }

    Knight(cas, myTabPos){
        var moves = [];

        if(cas.x+1 < 8 && cas.y+2 < 8 && (myTabPos[cas.x+1][cas.y+2]==-1 || this.piezas[myTabPos[cas.x+1][cas.y+2]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)))
            moves.push({x: cas.x+1, y: cas.y+2});
        if(cas.x+2 < 8 && cas.y+1 < 8 && (myTabPos[cas.x+2][cas.y+1]==-1 || this.piezas[myTabPos[cas.x+2][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)))
            moves.push({x: cas.x+2, y: cas.y+1});
        if(cas.x+2 < 8 && cas.y-1 >= 0 && (myTabPos[cas.x+2][cas.y-1]==-1 || this.piezas[myTabPos[cas.x+2][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)))
            moves.push({x: cas.x+2, y: cas.y-1});
        if(cas.x+1 < 8 && cas.y-2 >= 0 && (myTabPos[cas.x+1][cas.y-2]==-1 || this.piezas[myTabPos[cas.x+1][cas.y-2]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)))
            moves.push({x: cas.x+1, y: cas.y-2});
        if(cas.x-1 >= 0 && cas.y-2 >= 0 && (myTabPos[cas.x-1][cas.y-2]==-1 || this.piezas[myTabPos[cas.x-1][cas.y-2]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)))
            moves.push({x: cas.x-1, y: cas.y-2});
        if(cas.x-2 >= 0 && cas.y-1 >= 0 && (myTabPos[cas.x-2][cas.y-1]==-1 || this.piezas[myTabPos[cas.x-2][cas.y-1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)))
            moves.push({x: cas.x-2, y: cas.y-1});
        if(cas.x-2 >= 0 && cas.y+1 < 8 && (myTabPos[cas.x-2][cas.y+1]==-1 || this.piezas[myTabPos[cas.x-2][cas.y+1]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)))
            moves.push({x: cas.x-2, y: cas.y+1});
        if(cas.x-1 >= 0 && cas.y+2 < 8 && (myTabPos[cas.x-1][cas.y+2]==-1 || this.piezas[myTabPos[cas.x-1][cas.y+2]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1)))
            moves.push({x: cas.x-1, y: cas.y+2});

        return moves;
    }

    Bishop(cas, myTabPos){
        var moves = [];

        //NE
        var i = 1;
        while(cas.x+i < 8 && cas.y+i < 8){
            // 1 - casilla desocupada
            if(myTabPos[cas.x+i][cas.y+i] == -1)
                moves.push({x: cas.x+i, y: cas.y+i});
            else{
            // 2 - casilla ocupada
                // 2.1 - casilla ocupada por pieza contraria
                if(this.piezas[myTabPos[cas.x+i][cas.y+i]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x+i, y: cas.y+i});
                // 2.2 - casilla ocupada por pieza propia
                break;
            }
            ++i;
        }

        //SE
        i = 1;
        while(cas.x+i < 8 && cas.y-i >= 0){
            // 1 - casilla desocupada
            if(myTabPos[cas.x+i][cas.y-i] == -1)
                moves.push({x: cas.x+i, y: cas.y-i});
            else{
            // 2 - casilla ocupada
                // 2.1 - casilla ocupada por pieza contraria
                if(this.piezas[myTabPos[cas.x+i][cas.y-i]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x+i, y: cas.y-i});
                // 2.2 - casilla ocupada por pieza propia
                break;
            }
            ++i;
        }

        //SO
        i = 1;
        while(cas.x-i >= 0 && cas.y-i >= 0){
            // 1 - casilla desocupada
            if(myTabPos[cas.x-i][cas.y-i] == -1)
                moves.push({x: cas.x-i, y: cas.y-i});
            else{
            // 2 - casilla ocupada
                // 2.1 - casilla ocupada por pieza contraria
                if(this.piezas[myTabPos[cas.x-i][cas.y-i]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x-i, y: cas.y-i});
                // 2.2 - casilla ocupada por pieza propia
                break;
            }
            ++i;
        }

        //NO
        i = 1;
        while(cas.x-i >= 0 && cas.y+i < 8){
            // 1 - casilla desocupada
            if(myTabPos[cas.x-i][cas.y+i] == -1)
                moves.push({x: cas.x-i, y: cas.y+i});
            else{
            // 2 - casilla ocupada
                // 2.1 - casilla ocupada por pieza contraria
                if(this.piezas[myTabPos[cas.x-i][cas.y+i]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x-i, y: cas.y+i});
                // 2.2 - casilla ocupada por pieza propia
                break;
            }
            ++i;
        }

        return moves;
    }

    Rook(cas, myTabPos){
        var moves = [];

        // E
        var i = 1;
        while(cas.x+i < 8){
            // 1 - casilla desocupada
            if(myTabPos[cas.x+i][cas.y] == -1)
                moves.push({x: cas.x+i, y: cas.y});
            else{
            // 2 - casilla ocupada
                // 2.1 - casilla ocupada por pieza contraria
                if(this.piezas[myTabPos[cas.x+i][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x+i, y: cas.y})
                // 2.2 - casilla ocupada por pieza propia
                break;
            }
            ++i;
        }

        // O
        i = 1;
        while(cas.x-i >= 0){
            // 1 - casilla desocupada
            if(myTabPos[cas.x-i][cas.y] == -1)
                moves.push({x: cas.x-i, y: cas.y});
            else{
            // 2 - casilla ocupada
                // 2.1 - casilla ocupada por pieza contraria
                if(this.piezas[myTabPos[cas.x-i][cas.y]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x-i, y: cas.y})
                // 2.2 - casilla ocupada por pieza propia
                break;
            }
            ++i;
        }

        // N
        i = 1;
        while(cas.y+i < 8){
            // 1 - casilla desocupada
            if(myTabPos[cas.x][cas.y+i] == -1)
                moves.push({x: cas.x, y: cas.y+i});
            else{
            // 2 - casilla ocupada
                // 2.1 - casilla ocupada por pieza contraria
                if(this.piezas[myTabPos[cas.x][cas.y+i]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x, y: cas.y+i})
                // 2.2 - casilla ocupada por pieza propia
                break;
            }
            ++i;
        }

        // S
        i = 1;
        while(cas.y-i >= 0){
            // 1 - casilla desocupada
            if(myTabPos[cas.x][cas.y-i] == -1)
                moves.push({x: cas.x, y: cas.y-i});
            else{
            // 2 - casilla ocupada
                // 2.1 - casilla ocupada por pieza contraria
                if(this.piezas[myTabPos[cas.x][cas.y-i]].tipo.charAt(1) != this.piezas[myTabPos[cas.x][cas.y]].tipo.charAt(1))
                    moves.push({x: cas.x, y: cas.y-i})
                // 2.2 - casilla ocupada por pieza propia
                break;
            }
            ++i;
        }

        return moves;
    }

    Move(cas1, cas2){
        // 1.2.2.2.1 - Eliminar pieza en la casilla destino (si hay)
        if(this.tabPos[cas2.x][cas2.y] != -1){
            this.EliminarPieza(this.tabPos[cas2.x][cas2.y]);
            this.tabPos[cas2.x][cas2.y] = -1;
        }

        // 1.2.2.2.2 - Actualiza tabPos
        this.tabPos[cas2.x][cas2.y] = JSON.parse(JSON.stringify(this.tabPos[cas1.x][cas1.y]));        //casilla nueva
        this.tabPos[cas1.x][cas1.y] = -1;   //casilla vieja

        // 1.2.2.2.3 - Mover pieza
        this.piezas[this.tabPos[cas2.x][cas2.y]].Drop(cas2);

        // 1.2.2.2.4 - Terminar turno
        this.turno = !this.turno;
    }

    loadConfigs(){
        this.configurations = [];

        fetch('openings.txt') // Replace 'yourfile.txt' with the path to your .txt file
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(textContent => {
                this.configurations = JSON.parse(textContent);   // Now 'textContent' contains the content of the text file as a single string
                this.PopulateDropdown();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        
    }

    PopulateDropdown(){

        // Get the dropdown element
        var dropdown = document.getElementById('configList');

        // Clear existing options
        dropdown.innerHTML = '';

        // Add options from the list
        for (var i = 0; i < this.configurations.length; i++) {
            var option = document.createElement('option');
            option.value = this.configurations[i].name;
            option.text = this.configurations[i].name;
            dropdown.appendChild(option);
        }
    }

    loadConfig(){
        this.LoadInitialConfig();

        // Retrieve the selected value from localStorage
        var selectedValue = document.getElementById('configList').value;
        

        for(var i=0; i<this.configurations.length; ++i){
            if(this.configurations[i].name == selectedValue){
                this.config = JSON.parse(JSON.stringify(this.configurations[i].config));
            }
        }

        for(var i=0; i<this.config.length; ++i)
            this.Move(this.config[i].i, this.config[i].f);
    }

    LoadInitialConfig(){
        this.piezas.length = 0;

        this.tabPos = [ [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1],];
        
        for(var i=0; i<this.initialConfig.length; ++i){
            this.tabPos[this.initialConfig[i].x][this.initialConfig[i].y] = this.piezas.length;
            this.piezas.push(new Pieza(this.ctx, this.canvas, this.initialConfig[i].tipo, this.initialConfig[i].color, this.initialConfig[i].x, this.initialConfig[i].y));
            if(this.initialConfig[i].tipo === 'kw'){
                this.rey.w = i;
            }else if(this.initialConfig[i].tipo === 'kb'){
                this.rey.b = i;
            }
        }
    }

    saveConfig(){
        var name = document.getElementById("saveConfigName").value;
        console.log(this.configurations);
        if(name && !this.configurations.some(obj=> obj.name == name)){
            this.configurations.push({name: name, config: JSON.parse(JSON.stringify(this.config))});
            this.PopulateDropdown();
        }
    }

    saveAll(){
        // Sample string to save
        var content = JSON.stringify(this.configurations);

        // Create a Blob from the string content
        var blob = new Blob([content], { type: 'application/json' });

        // Create a link element
        var link = document.createElement('a');

        // Set the download attribute and create a URL for the Blob
        link.download = 'openings.txt';
        link.href = URL.createObjectURL(blob);

        // Append the link to the document body
        document.body.appendChild(link);

        // Trigger a click on the link to start the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
    }

    shuffle(){
        this.LoadInitialConfig();

        var selectedValue = Math.floor(Math.random()*(this.configurations.length));
        this.config = JSON.parse(JSON.stringify(this.configurations[selectedValue].config));

        for(var i=0; i<this.config.length; ++i)
            this.Move(this.config[i].i, this.config[i].f);
    }

    update(){
        var str = "";
        str += "moves: <br>";
        for(var i=0; i<this.config.length; i+=2){
            var ini = String.fromCharCode('a'.charCodeAt()+this.config[i].i.x) + (this.config[i].i.y + 1);
            var fin = String.fromCharCode('a'.charCodeAt()+this.config[i].f.x) + (this.config[i].f.y + 1);
            str += `${ini} ${fin}, `;
            if(i+1 < this.config.length){
                ini = String.fromCharCode('a'.charCodeAt()+this.config[i+1].i.x) + (this.config[i+1].i.y + 1);
                fin = String.fromCharCode('a'.charCodeAt()+this.config[i+1].f.x) + (this.config[i+1].f.y + 1);
                str += `${ini} ${fin}`;
            }
            str += "<br>";
        }
        document.getElementById("marcas").innerHTML = str;
    }

    draw(){
        this.ctx.drawImage(RSC.get('tablero'), 0, 0);
        for(var i=0; i<this.piezas.length; ++i){
            this.piezas[i].Draw();
        }
        for(var i=0; i<this.marcas.length; ++i){
            this.ctx.drawImage(RSC.get('marca'), this.marcas[i].x*50, 350-this.marcas[i].y*50);
        } 
    }
}