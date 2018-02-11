export declare class AWS_S3_SBD {
    private db;
    private options;
    dbname: string;
    awsCreds: object;
    awsSDB: any;
    constructor(db: string, options: any);
    createDB: () => Promise<any>;
    openDB: () => Promise<any>;
    private sendSDB;
    private createOpts;
}
