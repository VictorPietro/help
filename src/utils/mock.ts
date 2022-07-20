import { addDays } from "date-fns";

const today = new Date();

function randomNumber(minimum, maximum) {
    return Math.round(Math.random() * (maximum - minimum) + minimum);
}

const mockSingleAssetFromSocket: SingleOptionOrAssetFromSocket = {
    code: "PETR4",
    type: "ASSET",
    trades: 81405,
    bidAmount: 40700,
    bidBest: 33.53,
    lastPrice: 33.54,
    askBest: 33.54,
    askAmount: 7800,
    expirationDateTimestamp: addDays(today, 10).getTime(),
    diasUteis: 21.04,
}

// CEDRO
// https://files.cedrotech.com/Documentos/MarketData/API_websocket.pdf

// perguntar: como pegar dias uteis; como pegar listagem de opçoes de um ativo

// Exemplo
let ob = { "values": { "2": "13,32", "3": "13,31", "4": "13,33" }, "type": "QuoteType", "parameter": "petr4" };

let trades = ob.values["9"]; // Volume acumulado dos negócios
let bidAmount = ob.values["3"]; // Melhor oferta de compra
let bidBest = ob.values["17"]; // Volume acumulado das melhores ofertas de compra
let lastPrice = ob.values["2"]; // Preço do último negócio
let askBest = ob.values["4"]; // Melhor oferta de venda
let askAmount = ob.values["18"]; // Volume acumulado das melhores ofertas de venda

const mockSingleOptionFromSocket: SingleOptionOrAssetFromSocket = {
    type: "CALL",
    trades: 158,
    bidAmount: 9000,
    bidBest: 2.68,
    lastPrice: 2.63,
    askBest: 2.71,
    askAmount: 20600,
    strike: 88.30,
    expirationDateTimestamp: addDays(today, 28).getTime(),
    diasUteis: 16.23,
};

const mockSingleOption: SingleOption = {
    type: "CALL",
    strike: 26.10,
    expirationDateTimestamp: addDays(today, 2).getTime(),
    trades: randomNumber(100, 5000),
    greeks: {
        delta: 0.95,
        gamma: 0.95,
        theta: 0.95,
        vega: 0.95,
    },
    bidIV: 38.4,
    bidBest: 1.87,
    askIV: 38.9,
    askBest: 1.89,
    lastPrice: 1.88,
};

const mockMultipleOption: SingleOptionOrAssetFromSocket[] = [
    {
        code: "PETRF352",
        type: "CALL",
        trades: 406,
        bidAmount: 148400,
        bidBest: 0.48,
        lastPrice: 0.49,
        askBest: 0.50,
        askAmount: 72900,
        strike: 36.34,
        expirationDateTimestamp: addDays(today, 28).getTime(),
        diasUteis: 21,
    },
]

const mockOptionsPayload = [
    {
        expirationDate: addDays(today, 2).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }),
        expirationDateTimestamp: addDays(today, 2).getTime(),
        options: [
            {
                strike: 35,
                calls: [{
                    trades: randomNumber(100, 5000),
                    greeks: {
                        delta: 0.95,
                        gamma: 0.95,
                        theta: 0.95,
                        vega: 0.95,
                    },
                    bidIV: 10.10,
                    bidBest: 2.50,
                    askIV: 20.20,
                    askBest: 2.25,
                    lastPrice: 2.35,
                }],
                puts: [{
                    trades: randomNumber(100, 5000),
                    greeks: {
                        delta: 0.95,
                        gamma: 0.95,
                        theta: 0.95,
                        vega: 0.95,
                    },
                    bidIV: 10.10,
                    bidBest: 2.50,
                    askIV: 20.20,
                    askBest: 2.25,
                    lastPrice: 2.35,
                }]
            },
        ],
    },
];

export { mockOptionsPayload, mockSingleOption, mockSingleOptionFromSocket, mockSingleAssetFromSocket, mockMultipleOption };
