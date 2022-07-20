import { calculateBusinessDaysInterval } from "./datesHandler";
import { callputbs } from "./module2";
import { DTV, justoDefault, ratioVCPVVD, VCP, VVD } from "./sheetFormulas";

function calculateOptionBS(
    strike,
    // trades,
    // bidAmount,
    bidBest,
    lastPrice,
    askBest,
    // askAmount,
    expirationDateTimestamp,
    // optionExpirationDate,
    selic = 13.25,
    customVol = 40,
    ka = 1,
    kd = 1,
    kt = 1,
    kv = 1,
) {

    const today = new Date();
    let diasUteis = calculateBusinessDaysInterval(today, expirationDateTimestamp);

    // get justoDefault ($I$14)
    const justoD = justoDefault(bidBest, askBest, lastPrice);

    // TODO remove ceil
    const difVCPVVD = ratioVCPVVD(diasUteis, customVol, kd, ka, kt, justoD, strike);

    // callputbs(justoD, strike, taxa_juros, dif_VCP_VVD/100, dias_uteis, 1)
    const justo = callputbs(justoD, strike, selic, (difVCPVVD / 100), diasUteis, 1);

    // VCP(difVCPVVD, ocp, justoDefault, strike, taxaJuros, diasUteis)
    const calculatedVCP = VCP(difVCPVVD, bidBest, justoD, strike, selic, diasUteis);

    // VCP(ocp, difVCPVVD, justoDefault, strike, taxaJuros, diasUteis)
    const calculatedVVD = VVD(askBest, difVCPVVD, justoD, strike, selic, diasUteis);

    // DTV(diasUteis, justoDefault, strike, taxaJuros, difVCPVVD, kv)
    const calculatedDTV = DTV(diasUteis, justoD, strike, selic, difVCPVVD, kv);

    // JUSTO, DIF%, V.CP, V.VD, DTV, JUSTO DEFAULT
    const optionData = { justo, difVCPVVD, calculatedVCP, calculatedVVD, calculatedDTV, justoD };

    return optionData;
}

import { inject, injectable } from "tsyringe";
import { IAssetsRepository } from "@modules/options/repositories/IAssetsRepository";
import { IOptionsRepository } from "@modules/options/repositories/IOptionsRepositroy";

@injectable()
class FetchSubscribedTickers {
    constructor(
        @inject("AssetsRepository")
        private assetsRepository: IAssetsRepository,
        @inject("OptionsRepository")
        private optionsRepository: IOptionsRepository,
    ) { }

    async execute(get_assets = true, get_options = true,): Promise<any[]> {
        let subscribedAssets = [];
        let subscribedOptions = [];
        let subscribed = [];

        if (get_assets) {
            subscribedAssets = await this.assetsRepository.findSubscribed();

            subscribedAssets.map((asset) => {
                subscribed.push(asset.ticker);
            });
        }

        if (get_options) {
            subscribedOptions = await this.optionsRepository.findSubscribed();

            subscribedOptions.map((option) => {
                subscribed.push(option.ticker);
            });
        }

        return subscribed;
    }
}

export { calculateOptionBS, FetchSubscribedTickers };
