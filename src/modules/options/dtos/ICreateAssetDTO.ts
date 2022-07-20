interface ICreateAssetDTO {
    name: string;
    ticker: string;
    latest_price?: number;
    is_subscribed?: boolean;
}

export { ICreateAssetDTO };
