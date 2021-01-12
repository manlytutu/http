declare class Instance {
    static request(params: any): Promise<object>;
    static get(req: any): Promise<object>;
    static post(req: any): Promise<object>;
    static put(req: any): Promise<object>;
    static delete(req: any): Promise<object>;
}
export { Instance };
