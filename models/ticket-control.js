const path = require("path");
const fs = require("fs");

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketCotrol {
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimosTickets = [];

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo, //ultimo ticket impreso
            hoy: this.hoy, //dia de hoy
            tickets: this.tickets,//tickets pendientes por atender
            ultimosTickets: this.ultimosTickets, //tickets ya atendidos
        };
    }

    init() {
        const { hoy, tickets, ultimo, ultimosTickets } = require("../db/data.json");

        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimosTickets = ultimosTickets;
        } else {
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, "../db/data.json");

        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);
        this.guardarDB();
        return "Ticket " + ticket.numero;
    }

    atenderTicket(escritorio) {
        //no tenemos tickets

        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); //quita el primero y lo retorna
        ticket.escritorio = escritorio;
        this.ultimosTickets.unshift(ticket); //agrega al inicio

        if (this.ultimosTickets.length > 4) {
            this.ultimosTickets.splice(-1, 1); //posicion -1 quita 1 elemento
        }

        this.guardarDB();
        return ticket;
    }
}

module.exports = TicketCotrol;
