'use strict';

class Request {
    static build(buffer) {
        let request = new Request();

        request.read(buffer);
        request.process();
        return request;
    }

    constructor() {
        this.buffer     = Buffer.alloc(0);
        this.isComplete = false;
        this.method     = null;
        this.resource   = null;
        this.parameters = { };
        this.version    = null;
        this.headers    = { };
        this.body       = null;
    }

    read(buffer) {
        if(!buffer)
            this.isComplete = true;
        else
            this.buffer = Buffer.concat([this.buffer, buffer]);
    }

    process() {
        let message = this.buffer.toString().split('\r\n'),
            request = message.shift().split(' ');

        this.method   = request[0].toUpperCase();
        this.resource = request[1].charAt(request[1].length - 1) === '/' ? request[1] : request[1] + '/';
        this.version  = request[2].substring(5);

        message.slice(0, message.indexOf('\r\n') - 1).forEach(header => {
            this.headers[header.substring(0, header.indexOf(':'))] = header.substring(header.indexOf(':') + 1).trim();
        });

        this.body = message.slice(message.indexOf('\r\n')).join('\r\n').trim();
    }

    toString() {
        return `${this.method} ${this.resource} HTTP/${this.version}`;
    }
}

module.exports = Request;
