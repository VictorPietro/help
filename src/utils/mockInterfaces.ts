interface Greeks {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
}

interface Option {
    trades: number;
    greeks: Greeks;
    bidIV: number;
    bidBest: number;
    askIV: number;
    askBest: number;
    lastPrice: number;
}

interface SingleOptionOrAssetFromSocket {
    code?: string;
    type: 'CALL' | 'PUT' | 'ASSET';
    trades: number;
    bidAmount: number;
    bidBest: number;
    lastPrice: number;
    askBest: number;
    askAmount: number;
    strike?: number;
    expirationDateTimestamp: number;
    diasUteis?: number;
    vcpvvd?: number;
    simulationAmount?: number;
    justo?: number;
}

interface SingleOption {
    type: 'CALL' | 'PUT';
    strike: number;
    expirationDateTimestamp: number;
    trades: number;
    greeks: Greeks;
    bidIV: number;
    bidBest: number;
    askIV: number;
    askBest: number;
    lastPrice: number;
}

interface Series {
    expirationDate: string;
    expirationDateTimestamp: number;

    options: OptionsObject[];
}

interface OptionsObject {
    strike: number;

    calls: Option[];
    puts: Option[];
}

interface OptionsPayload {
    asset: string;
    assetPrice: number;

    series: Series[];
}
