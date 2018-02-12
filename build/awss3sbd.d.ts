export declare class AWS_S3_SBD {
    private db;
    private options;
    dbname: string;
    awsCreds: object;
    awsSDB: any;
    constructor(db: string, options: any);
    create: () => Promise<any>;
    open: () => Promise<any>;
    get: (item: string) => Promise<any>;
    select: (expression: string) => Promise<any>;
    put: (item: string) => Promise<any>;
    private sendSDB;
    private createOpts;
}
