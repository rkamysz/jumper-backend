export class Token {
  constructor(
    public readonly blockNumber: bigint,
    public readonly timeStamp: number,
    public readonly hash: string,
    public readonly nonce: number,
    public readonly blockHash: string,
    public readonly from: string,
    public readonly contractAddress: string,
    public readonly to: string,
    public readonly value: bigint,
    public readonly tokenName: string,
    public readonly tokenSymbol: string,
    public readonly tokenDecimal: number,
    public readonly transactionIndex: number,
    public readonly gas: number,
    public readonly gasPrice: number,
    public readonly gasUsed: number,
    public readonly cumulativeGasUsed: number,
    public readonly input: string,
    public readonly confirmations: number
  ) {}
}

/*
        {
            "blockNumber": "16820501",
            "timeStamp": "1678727915",
            "hash": "0x1fe2687e139d6778cfd516ed59f60228446471128b59f2d2e85f81fafaac60a1",
            "nonce": "30",
            "blockHash": "0x69e2ef623695c963466ad4ac2060124646c4df9752056d40b492d1614bf3bd3e",
            "from": "0x0000000000000000000000000000000000000000",
            "contractAddress": "0x4665e227c521849a202f808e927d1dc5f63c7941",
            "to": "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
            "value": "7000000000000000000",
            "tokenName": "OCCoin",
            "tokenSymbol": "OCC",
            "tokenDecimal": "18",
            "transactionIndex": "197",
            "gas": "101883",
            "gasPrice": "33774149025",
            "gasUsed": "85022",
            "cumulativeGasUsed": "12754193",
            "input": "deprecated",
            "confirmations": "3034685"
        },
        */
