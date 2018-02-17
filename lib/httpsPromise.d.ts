export declare class httpPromise {
    private params;
    private body;
    constructor(parmas?: object, body?: any);
    setParams: object;
    readonly getParams: object;
    setBody: any;
    readonly getBody: any;
    send: (params?: object, body?: any) => Promise<any>;
}
