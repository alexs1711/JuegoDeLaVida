var filas = 15;
var cols = 15;
var numT = 0;
var Gen = 0;
var playing = false;

var celda = new Array(filas);
var siguienteCelda = new Array(filas);

var timer;
var reproductionTime = 100;

function iniciarCeldas() {
    for (var i = 0; i < filas; i++) {
        celda[i] = new Array(cols);
        siguienteCelda[i] = new Array(cols);
    }
}

function resetCeldas() {
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < cols; j++) {
            celda[i][j] = 0;
            siguienteCelda[i][j] = 0;
        }
    }
}

function copiarResetearCeldas() {
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < cols; j++) {
            celda[i][j] = siguienteCelda[i][j];
            siguienteCelda[i][j] = 0;
        }
    }
}

function iniciar() {
    crearTabla();
    iniciarCeldas();
    resetCeldas();
    menuBotones();
}

function crearTabla() {
    var tablaCeldas = document.getElementById('gridContainer');
    if (!tablaCeldas) {
       
        console.error("No hay div!");
    }
    var table = document.createElement("table");
    table.id = "T"+numT;
    
    for (var i = 0; i < filas; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id",  "T"+numT+"_"+i + "_" + j);
            cell.setAttribute("class", "muerto");
            cell.onclick = ChuclarBotones;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    tablaCeldas.appendChild(table);
    }

    function ChuclarBotones() {
        var filacol = this.id.split("_");
        var fila = filacol[1];
        var col = filacol[2];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("vivo") > -1) {
            this.setAttribute("class", "muerto");
            celda[fila][col] = 0;
            
        } else {
            this.setAttribute("class", "vivo");
            celda[fila][col] = 1;
            
        }
        
    }

    function actualizarVista() {
        for (var i = 0; i < filas; i++) {
            for (var j = 0; j < cols; j++) {
                var cell = document.getElementById("T"+numT+"_"+i + "_" + j);
                if (celda[i][j] === 0) {
                    cell.setAttribute("class", "muerto");
                } else {
                    cell.setAttribute("class", "vivo");
                }
            }
        }
    }
    function actualizarVistaNextGen() {
        numTT=numT+1;
        for (var i = 0; i < filas; i++) {
            for (var j = 0; j < cols; j++) {
               console.log("calculando para la gen en la tabla"+numT);
                var cell = document.getElementById("T"+numT+"_"+i + "_" + j);
                if (celda[i][j] === 0) {
                    cell.setAttribute("class", "muerto");
                } else {
                    cell.setAttribute("class", "vivo");
                }
            }
        }
    }

function menuBotones() {
    
    var iniciar = document.getElementById('start');
    iniciar.onclick = iniciarBoton;
    
    var limpiar = document.getElementById('clear');
    limpiar.onclick = limpiarBoton;
    
    var random = document.getElementById("random");
    random.onclick = aleatorioBoton;
    
    var siguiente = document.getElementById('next');
    siguiente.onclick = BotonSiguiente;
    
     var reinicio = document.getElementById('reset');
    reinicio.onclick = recargarPagina;
}

function ReiniciarJuego(){
    var div = document.getElementById('main');
    div.style.display = 'block';
    var botones = document.getElementById('botones');
    botones.style.display = 'none';
    var divestiloso = document.getElementById('gridContainer');
    divestiloso.style.display = 'none';  
    var tabla = document.getElementById('T'+numT);
    tabla.style.display = 'none';
    numT++;
    
}
function recargarPagina(){
    window.location.reload();
}
function BotonSiguiente(){
    siguienteGen();
}
function aleatorioBoton() {
    if (playing) return;
    limpiarBoton();
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive === 1) {
                var cell = document.getElementById("T"+numT+"_"+i + "_" + j);
                cell.setAttribute("class", "vivo");
                celda[i][j] = 1;
            }
        }
    }
}

function limpiarBoton() {
    console.log("Limpiar celdas y parar el juego");
    
    playing = false;
    var iniciar = document.getElementById('start');
    iniciar.innerHTML = "Loop";    
    clearTimeout(timer);
    
    var cellsList = document.getElementsByClassName("vivo");
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "muerto");
    }
    resetCeldas();
   
}

function iniciarBoton() {
    if (playing) {
        console.log("Pausar el juego");
        playing = false;
        this.innerHTML = "Continuar";
        clearTimeout(timer);
    } else {
        console.log("Continuar el juego");
        playing = true;
        this.innerHTML = "Pausar";
        play();
    }
}

function play() {
    siguienteGen();
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function siguienteGen() {
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < cols; j++) {
            reglasJuego(i, j);
        }
    }
    
    copiarResetearCeldas();
    actualizarVista();
}
function siguienteGenEnGen() {
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < cols; j++) {
            reglasJuego(i, j);
        }
    }
    
    copiarResetearCeldas();
    actualizarVistaNextGen();
    
}

function reglasJuego(fila, col) {
    var numVecinos = contarVecinos(fila, col);
    if (celda[fila][col] === 1) {
        if (numVecinos < 2) {
            siguienteCelda[fila][col] = 0;
        } else if (numVecinos === 2 || numVecinos === 3) {
            siguienteCelda[fila][col] = 1;
        } else if (numVecinos > 3) {
            siguienteCelda[fila][col] = 0;
        }
    } else if (celda[fila][col] === 0) {
            if (numVecinos === 3) {
                siguienteCelda[fila][col] = 1;
            }
        }
    }
    
function contarVecinos(fila, col) {
    var count = 0;
    if (fila-1 >= 0) {
        if (celda[fila-1][col] === 1) count++;
    }
    if (fila-1 >= 0 && col-1 >= 0) {
        if (celda[fila-1][col-1] === 1) count++;
    }
    if (fila-1 >= 0 && col+1 < cols) {
        if (celda[fila-1][col+1] === 1) count++;
    }
    if (col-1 >= 0) {
        if (celda[fila][col-1] === 1) count++;
    }
    if (col+1 < cols) {
        if (celda[fila][col+1] === 1) count++;
    }
    if (fila+1 < filas) {
        if (celda[fila+1][col] === 1) count++;
    }
    if (fila+1 < filas && col-1 >= 0) {
        if (celda[fila+1][col-1] === 1) count++;
    }
    if (fila+1 < filas && col+1 < cols) {
        if (celda[fila+1][col+1] === 1) count++;
    }
    return count;
}

function BotonesRadio(){
    if (document.getElementById("genEnGen").checked){
        IniciarGenEnGen();
    } 
    else if (document.getElementById("XnumGen").checked){
        XnumGen();
    }
    else {
        alert("Seleccione una de las dos opciones");
    }
}

function IniciarGenEnGen(){
    var div = document.getElementById('main');
    div.style.display = 'none';
    var botones = document.getElementById('botones');
    botones.style.display = 'block';
        cols = document.getElementById('ancho').value;
    filas  = document.getElementById('altura').value;
    iniciar();
    var divestiloso = document.getElementById('gridContainer');
    divestiloso.style.display = 'inline-block';  
}

function XnumGen(){
    gen = document.getElementById("gen").value;
    cols = document.getElementById('ancho').value;
    filas  = document.getElementById('altura').value;
    celda = new Array(filas);
    siguienteCelda = new Array(filas);
    NumGenenGen();
    crearTabla();
    iniciarCeldas();
    resetCeldas();
    
    var div = document.getElementById('main');
    div.style.display = 'none';
    BotoneraCalcGen();
    
    var CalcDiv = document.getElementById('CalcularGen');
    CalcDiv.style.display = 'block';
    

}
function NumGenenGen() {
    var mainDiv=document.getElementById('gridContainer');
    var newSpan=document.createElement('span'); 
    newSpan.innerHTML="Generación "+numT; 
    mainDiv.appendChild(newSpan);
}
function ProcesarXgen(){
    var Aletorio = document.getElementById('random2');
    Aletorio.style.display = 'none';
    var CalcDiv = document.getElementById('Calc');
    CalcDiv.style.display = 'none';
    var limpiar = document.getElementById('clearlimpia');
    limpiar.style.display = 'none';
    if (gen <= 0){
        alert("¡Tienes que introducir un numero de generaciones superior a 0!");
    }else {
        for(g = 0; g < gen ;g++){
    
    numT++;
    NumGenenGen();
    crearTabla();
    siguienteGenEnGen();
    actualizarVistaNextGen();}
    }
}

function BotoneraCalcGen() {
    
    var calc = document.getElementById('Calc');
    calc.onclick = ProcesarXgen;
    
    var random = document.getElementById("random2");
    random.onclick = aleatorioBoton;
    
    var reset2 = document.getElementById("reset2");
    reset2.onclick = recargarPagina;
    
    var limpiar = document.getElementById('clearlimpia');
    limpiar.onclick = limpiarBoton;
}
