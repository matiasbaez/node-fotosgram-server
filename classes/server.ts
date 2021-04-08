
const express = require('express');

export default class Server {

    public app: any;
    public port: number = 3000;

    constructor() {
        this.app = express();
    }

    start(callback: Function) {
        this.app.listen(this.port, callback);
    }
}