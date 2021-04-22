//referencias html

const lblEscritorio = document.querySelector('h1');

const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const lblAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);


lblAlert.style.display = "none";
if (!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText ="Escritorio "+escritorio;

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes',(pendientes)=>{
    if (pendientes !== 0) {
        lblAlert.style.display="";
        lblAlert.style.display="none";
    }
    lblPendientes.innerText = pendientes;
});

btnAtender.addEventListener( 'click', () => {

    socket.emit('atender-ticket',{escritorio},({ok,ticket,msg})=>{
        if(!ok){
        lblTicket.innerText = `Nadie`
        lblAlert.innerText=msg;
            return lblAlert.style.display="";
        }
        lblTicket.innerText = `Ticket ${ticket.numero}`

    });

    
});