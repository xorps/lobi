const server = require('./server.js');

class Lobby {
    constructor(maxSize) {
        this.members = new Set();
        this.maxSize = maxSize || 4;
    }
    join(member, reply) {
        if (this.members.has(member)) {
            reply('You have already joined!');
        } else {
            this.members.add(member);
            reply('You have joined!');
        }
    }
    leave(member, reply) {
        if (this.members.has(member)) {
            this.members.delete(member);
            reply('You have left!');
        } else {
            reply('You have already left!');
        }
    }
    show(reply) {
        if (this.members.size > 0) {
            reply('Lobby: ' + Array.from(this.members).map(x => x.username).join(', '));
        } else {
            reply('Lobby is empty');
        }
    }
    tick() {
        const removeOffline = a => new Set(Array.from(a).filter(u => u.client.presence !== 'offline'));
        this.members = removeOffline(this.members);
        if (this.members.size >= this.maxSize) {
            const reply = (members => s => members.forEach(user => user.send(s)))(this.members);
            server.startServer(reply);
            this.members = new Set();
        }
    }
}

module.exports = { Lobby };