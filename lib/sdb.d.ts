export declare class SBD {
    private options;
    dbname: string;
    awsCreds: object;
    awsSDB: any;
    constructor(options?: any);
    create: (db: string) => Promise<any>;
    ListDomains: () => Promise<any>;
    destroy: (NameDB: string) => Promise<any>;
    open: (db: string) => Promise<any>;
    get: (item: string) => Promise<any>;
    select: (expression: string) => Promise<any>;
    delete: (item: string) => Promise<any>;
    put: (item: string) => Promise<any>;
    private sendSDB;
    private createParams();
    private createOpts;
}
