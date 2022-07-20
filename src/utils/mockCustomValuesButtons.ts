function mockGetTaxaSelic(): number {
    const selic = 10.7 / 100;

    return selic;
}

function mockGetCustomVol(): number {
    const customVol = 38.5 / 100;

    return customVol;
}

function mockGetKA() {
    const ka = 1;

    return ka;
}

function mockGetKD() {
    const kd = 1;

    return kd;
}

function mockGetKT() {
    const kt = 1;

    return kt;
}

function mockGetKV() {
    const kv = 0;

    return kv;
}

function mockDeviation(num: number) {
    const vol = mockGetCustomVol();

    const deviation = num * (vol / Math.sqrt(252));

    return deviation;
}

function mockGreeksManual(): any {
    const deviation = mockDeviation(1);

    const greeks = {
        DT: deviation,
        TT: 1,
        VG: 0,
        RO: 0,
    }

    return greeks;
}

export { mockGetTaxaSelic, mockGetCustomVol, mockGetKA, mockGetKD, mockGetKT, mockGetKV, mockDeviation, mockGreeksManual };
