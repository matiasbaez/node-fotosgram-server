const jwt = require('jsonwebtoken');

export default class Token {

    private static seed: string = 'LIAOIBLSGG7YGW5E2E47PHFBNL1GX1';
    private static expire: string = '30d';

    constructor() {}

    static getJWTToken(payload: any): string {
        
        const Payload = {
            user: payload
        }

        const options = {
            expiresIn: this.expire
        }

        return jwt.sign(Payload, this.seed, options);
    }

    static tokenControl(token: string) {
        
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.seed, (err: any, decoded: any) => {
                if (err) {
                    reject();
                } else {
                    resolve(decoded);
                }
            });
        });

    }
}