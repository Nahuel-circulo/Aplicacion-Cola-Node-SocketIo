const TicketCotrol = require("../models/ticket-control");

const ticketControl = new TicketCotrol();

const socketController = (socket) => {


    socket.emit('ultimo-ticket',ticketControl.ultimo);
    socket.emit('estado-actual',ticketControl.ultimosTickets);
    socket.emit('tickets-pendientes',ticketControl.tickets.length);


    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
    });

    socket.on('atender-ticket',({escritorio},callback)=>{
        if(!escritorio){
            return callback({
                ok:false,
                msg: 'Escritorio Obligarorio'
            })
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        console.log(ticketControl.tickets.length);
        //broadcast emite a todos los sockets conectados excepto a la conexion que lo esta llamanndo
        socket.broadcast.emit('estado-actual',ticketControl.ultimosTickets);
        socket.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);

        if (!ticket) {
            callback({
                ok:false,
                msg:'Ya no hay ticket'
            });
        }else{
            callback({
                ok:true,
                ticket
            })
        }
    });

}



module.exports = {
    socketController
}

