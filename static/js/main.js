//Comprueba que el navegador puede guardar en storage
if (typeof(Storage) !== 'undefined') {
} else {
  alert('This browser does not support local storage')
}

/**
  Local Storage Funtions
*/

const agregar_actualizar = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
  return true
}
 
const obtener = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

const eliminar = (key) => {
  localStorage.removeItem(key)
  return true
}


/**
 * Funciones de la todolist
 */

//// Variables ////
let addToDoButton = document.getElementById('addToDo');
let toDoContainer = document.getElementById('toDoContainer');

let NameInput = document.getElementById('NameInput');
let TimeInput = document.getElementById('TimeInput');
let ColorInput = document.getElementById('ColorInput');
let DescInput = document.getElementById('DescInput');

let ResetButton = document.getElementById('ResetButton')

var Version = "v0.2.0"

var data = [{
        'taskname': 'Bienvenido a tu lista de tareas pendientes de Focusing!',
        'date': GetTime(),
        'color': '#CCD1D1',
        'description': 'Focusing te ayudara en ...',
        'complete': false,
    },
    {
        'taskname': 'Tarea Completada',
        'date': GetTime(),
        'color': '#CCD1D1',
        'description': 'Example 1',
        'complete': true,
    }]

//// Verificacion ////
if (obtener('todolist') !== null){

    cargar_contenido(obtener('todolist'))

}else{

    agregar_actualizar('todolist', data)
    cargar_contenido(obtener('todolist'))

}

//// Service Worker ////
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/static/js/sw.js")
        .then(reg => console.log('Registro de SW exitoso', reg))
        .catch(err => console.warn('Error al tratar de registrar el sw', err))
  }
  
//// Funciones ////
function cargar_contenido(list){

    for (let step = 0; step < list.length; step++) {

        agregar_boton(step, list[step],false)

    }

}

function agregar_boton(step, object, save){

    if (save == true){

        var list = obtener('todolist')
        list.push(object)
        agregar_actualizar('todolist', list)

    }

    var paragraph = document.createElement('p');

    var color = document.createElement('div');
    color.classList.add('color');
    color.style.background = object['color'];
    paragraph.appendChild(color);

    var text = document.createElement('div');
    text.classList.add('text');
    
    var title = document.createElement('h5');
    title .innerText = `${object['taskname']} | ${object['date']['dia']}/${object['date']['mes']}/${object['date']['año']}   ${object['date']['hora']}:${object['date']['minuto']}`
    text.appendChild(title);

    var desc = document.createElement('h6');
    desc.innerText = `${object['description']}`
    text.appendChild(desc);

    paragraph.appendChild(text);

    if (object['complete'] == true){
        paragraph.style.textDecoration = "line-through";    
    }else{
        paragraph.style.textDecoration = null;
    }
    
    toDoContainer.appendChild(paragraph);

    paragraph.addEventListener('click', function(){
        
        var list = obtener('todolist')

        if (list[list.length-1]['complete'] == true){

            list[list.length-1]['complete'] = false
            paragraph.style.textDecoration = null;

        }else{

            list[list.length-1]['complete'] = true
            paragraph.style.textDecoration = "line-through";

        }
        
        agregar_actualizar('todolist', list)

    })
    
    paragraph.addEventListener('dblclick', function(){

        var list = obtener('todolist')
        list.splice(step, 1)
        agregar_actualizar('todolist', list)

        toDoContainer.removeChild(paragraph);

    })

}

function Comprobar(){
    var list = obtener('todolist')
    var time = GetTime()

    for (let step = 0; step < list.length; step++) {

        if (list[step]['date']['mes'] === time['mes'] && 
        list[step]['date']['dia'] === time['dia'] && 
        list[step]['date']['año'] === time['año'] && 
        list[step]['date']['hora'] === time['hora'] &&
        list[step]['date']['minuto'] === time['minuto'] &&
        list[step]['date']['second'] === time['second'] &&
        list[step]['complete'] === false) {
            notifyMe(title = `${list[step]['taskname']} in time!`, options = {body: 'Task is in time!', icon: '/static/img/icon_144.png'})
        }

    }
}

//// Llamadas ////
addToDoButton.addEventListener('click', function(){
    
    if (NameInput.value !== "" && TimeInput.value !== ""){

        var object = {
            'taskname': NameInput.value,
            'date': GetTime(time = TimeInput.value),
            'color': ColorInput.value,
            'description': DescInput.value,
            'complete': false,
        }
    
        agregar_boton(null, object, true)
        

        NameInput.value = ''
        TimeInput.value = ''
        ColorInput.value = '#FFFFFF'
        DescInput.value = ''
        
        
    }
    
})

ResetButton.addEventListener('click', function() {

    eliminar('todolist')
    location.reload(true)

})

/**
 * Funciones del reloj
 */

//// Variables ////
const $tiempo = document.getElementById('Information')

//// Funciones ////
function GetTime(time = null){
    if (time === null) {
        let f = new Date(),
        año = f.getFullYear(),
        dia = f.getDate(),
        mes = f.getMonth()+1,

        hora = f.getHours(),
        minuto = f.getMinutes(),
        second = f.getSeconds();

        return {mes, dia, año, hora, minuto, second}//Mes/Dia/Año/Hora/Minuto/Segundo
    } else {
        let f = new Date(time),
        año = f.getFullYear(),
        dia = f.getDate(),
        mes = f.getMonth()+1,

        hora = f.getHours(),
        minuto = f.getMinutes(),
        second = f.getSeconds();

        return {mes, dia, año, hora, minuto, second}//Mes/Dia/Año/Hora/Minuto/Segundo
    }
}

function UpdateClock(){

    timelist = GetTime()
    let f = new Date(),
    semana = ['SUN','MON','TUE','WED','THU','FRI','SAT'],
    showSemana = (semana[f.getDay()]);

    $tiempo.innerHTML = `${timelist['año']}-${timelist['mes']}-${timelist['dia']} ${showSemana}, ${timelist['hora']}:${timelist['minuto']}:${timelist['second']}  ${Version}`;

}
 
//// Llamadas ////
UpdateClock()
notifyMe(null)

setInterval(() => {
    Comprobar()
    UpdateClock()
}, 1000);


/*
    Pomodoro Functions 
*/

var start = document.getElementById('pomodoroStart');
var stop = document.getElementById('pomodoroPause/Stop');

var counter = document.getElementById('Clock');
var minutosInput = document.getElementById('pomodoroMinutos');
var segundosInput = document.getElementById('pomodoroSegundos');

//store a reference to a timer variable
var startTimer;
var segundos;
var minutos;

start.addEventListener('click', function(){

    counter.innerHTML = `${minutosInput.value}:${segundosInput.value}`

    if(startTimer === undefined){
        startTimer = setInterval(() => {timer()}, 1000)
    }
})

stop.addEventListener('click', function(){
    stopInterval()
    startTimer = undefined;
})

//Start Timer Function
function timer(){
    if(minutos === undefined && segundos === undefined) {
        minutos = minutosInput.value;
        segundos = segundosInput.value;
        console.log(minutos, segundos, "set")
    } else {
        if(segundos > 0) {
            segundos--;
            counter.innerHTML = `${minutos}:${segundos}`
            console.log(minutos, segundos, 1)
        } else if (minutos > 0 && segundos == 0) {
            minutos--;
            segundos = 59;
            console.log(minutos, segundos, 2)
            counter.innerHTML = `${minutos}:${segundos}`
        } else if (minutos == 0 && segundos == 0) {
            counter.innerHTML = `${minutos}:${segundos}`
            console.log(minutos, segundos, 3)
            notifyMe(title = `Pomodoro is in time!`, options = {body: 'Start your break time!', icon: '/static/img/icon_144.png'})
            stopInterval()
            startTimer = undefined;
            minutos = undefined;
            segundos = undefined;
        }
        
    }
}

//Stop Timer Function
function stopInterval(){
    clearInterval(startTimer);
}