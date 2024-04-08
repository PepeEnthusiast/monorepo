declare const Contract: typeof import("@bitcoin-computer/lib").Contract;
export declare class NFT extends Contract {
    name: string;
    symbol: string;
    offerTxRev: string;
    constructor(name?: string, symbol?: string);
    transfer(to: any): void;
    list(rev: any): void;
    unList(): void;
}
export interface ITBC721 {
    balanceOf(publicKey: string): Promise<number>;
    ownersOf(tokenId: string): Promise<string[]>;
    transfer(to: string, tokenId: string): Promise<void>;
}
export declare class TBC721 implements ITBC721 {
    computer: any;
    mod: string | undefined;
    constructor(computer: any, mod?: string);
    deploy(): Promise<string>;
    mint(name: string, symbol: string): Promise<NFT>;
    balanceOf(publicKey: string): Promise<number>;
    ownersOf(tokenId: string): Promise<string[]>;
    transfer(to: string, tokenId: string): Promise<void>;
}
export {};
