export declare class SBD {
    private db;
    private options;
    dbname: string;
    awsCreds: object;
    awsSDB: any;
    constructor(db: string, options: any);
    create: () => Promise<any>;
    destroy: (NameDB: string) => Promise<any>;
    open: () => Promise<any>;
    get: (item: string) => Promise<any>;
    select: (expression: string) => Promise<any>;
    delete: (item: string) => Promise<any>;
    put: (item: string) => Promise<any>;
    private sendSDB;
    private createOpts;
}
