declare class CryptoHelper {
    key: string;
    constructor(key: string);
    /**
     * 加密
     * @param word
     */
    encrypt(word: string | undefined): string;
}
export default CryptoHelper;
//# sourceMappingURL=encryption.d.ts.map