// A sub performs a task but does not return a value

import { callputbs, deltabs, deltabsput, gamabs, gamabsput, putbs, rhobs, rhobsput, tetabs, tetabsput, vegabs, vegabsput } from "./module2";
import { vldelta } from "./module3";
import { toFixedNumber } from "./numbersHandler";

/* ========== SHEET RELATED ========== */
// Public Tecla As String
function origem(): void {
    // 'posiciona origem operações
    // Range("C15").Select
    // Range("AA22").Select
}

/* ========== SHEET RELATED ========== */
function origem0(): void {
    // 'posiciona origem geral
    // Range("A1").Select
}

/* ========== SHEET RELATED ========== */
function copycol(c1, c2): void {
    // copiavalor lc(c1, 15, c1, 183), lc(c2, 15, c2, 183)
    // Application.CutCopyMode = False
    // Range(lc(c1, 12, c1, 13)).Select
}

/* ========== SHEET RELATED ========== */
function limpacol(c): void {
    // calcoff
    // limpacel lc(c, 15, c, 183)
    // Application.CutCopyMode = False
    // Range(lc(c, 12, c, 13)).Select
    // calcon
}

/* ========== SHEET RELATED ========== */
function limpacor(): void {
    // czc "A", "AS"
    // crc "H", 19
    // crc "J", 19
    // crc "U", 19, "Y"
    // crc "I", 35
    // crc "K", 35, "M"
    // crc "T", 35
    // crc "AC", 35, "AF"
    // crc "AG", 19, "AH"
    // crc "AI", 35
    // '  crc "AH", 35
    // crc "AK", 35
    // crc "N", 34, "S"
}

/* ========== SHEET RELATED ========== */
// ' color coluna
function crc(c1, n, c2?: any): void {
    // colorn lc(c1, 15, opv(c1, c2), 186), n, 1
}

/* ========== SHEET RELATED ========== */
// ' color zero coluna
function czc(c1, c2?: any): void {
    // colorzero lc(c1, 15, opv(c1, c2), 186)
    // corletra lc(c1, 15, opv(c1, c2), 186), 1
}

/* ========== SHEET RELATED ========== */
function lpc(c1, c2?: any): void {
    // limpacel lc(c1, 15, opv(c1, c2), 186)
}

/* ========== SHEET RELATED ========== */
// ' verifica valor opcional se c2 não existe adota c1
function opv(c1, c2) {
    // If VarType(c2) = 10 Then c2 = c1
    // opv = c2
}

/* ========== SHEET RELATED ========== */
function historico(): void {
    // ' posiciona no locais de ordens
    // LIN = Range("FH13")
    // i = LIN + 15
    // Range("FH15").Select
}

/* ========== SHEET RELATED ========== */
function corotm(): void {
    // ioa = Range("W15")
    // i0 = 15
    // For i = 15 To 186
    //     If Range("A" & i) = "" Then i = 186
    //     io = Range("W" & i)
    //     If ioa <= 0 And io >= 0 Then
    //     i0 = i
    //     ElseIf ioa > 0 And (io < 0 Or io = "" Or i = 186) Then
    //     If i < 186 Then i1 = i - 1 Else i1 = 186
    //     colorn lc("A", i0, "D", i1), 24, 5
    //     colorn lc("F", i0, "G", i1), 24, 5

    //     colorn lc("H", i0, "H", i1), 36, 5
    //     colorn lc("J", i0, "J", i1), 36, 5
    //     colorn lc("U", i0, "Y", i1), 36, 5

    //     colorn lc("I", i0, "I", i1), 42, 5
    //     colorn lc("K", i0, "M", i1), 42, 5
    //     colorn lc("AB", i0, "AB", i1), 24, 5
    //     colorn lc("AC", i0, "AF", i1), 42, 5
    //     colorn lc("AG", i0, "AH", i1), 36, 5


    //     colorn lc("T", i0, "T", i1), 42, 5
    //     colorn lc("N", i0, "S", i1), 37, 5

    //     colorn lc("AL", i0, "AS", i1), 24, 5


    //     End If
    //     ioa = io
    // Next
}

/* ========== SHEET RELATED ========== */
// ' indica cor carteira
function corcrt(i): void {
    // qt = Range("Z" & i)
    // If qt <> "" Then
    //     colorn "A" & i, 4, 1
    //     colorn "E" & i, 4, 1
    //     colorn lc("I", i, "J", i), 4, 1
    //     colorn "L" & i, 4, 1
    //     colorn lc("AG", i, "AH", i), 4, 1
    // End If
}

/* ========== SHEET RELATED ========== */
function corpend(i): void {
    // qt = Range("AB" & i)
    // If qt <> "" Then
    //     If qt > 0 Then
    //     colorn lc("C", i, "D", i), 46, 1
    //     Else
    //     colorn lc("F", i, "G", i), 46, 1
    //     End If
    //     colorn "I" & i, 46, 1
    // End If
}

/* ========== SHEET RELATED ========== */
function limpager(): void {
    // calcoff
    // limpacel "A11:G183"
    // lpc "AL", "AN"
    // lpc "AJ", "AJ"
    // limpacor
    // calcon
}

// calcula e printa todas gregas
/* ========== SHEET RELATED ========== */
function calculateSingleOptionGreeks(justoDefault, taxaSelic, opcao): any {
    let difVCPVVD = (opcao.vcpvvd) / 100;

    const gregas = {
        //     pcel "N" & i, 100 * gamabs(s, x, r, v, t, 1)
        gamma: 100 * gamabs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
        //     pcel "O" & i, 100 * deltabs(s, x, r, v, t, 1)
        delta: 100 * deltabs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
        //     pcel "P" & i, tetabs(s, x, r, v, t, 1)
        theta: tetabs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
        //     pcel "Q" & i, 100 * vegabs(s, x, r, v, t, 1)
        vega: 100 * vegabs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
        //     pcel "R" & i, 100 * rhobs(s, x, r, v, t, 1)
        rho: 100 * rhobs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
    };

    return gregas;
}

// calcula e printa todas gregas
/* ========== SHEET RELATED ========== */
function cgregas(justoDefault, taxaSelic, opcoes): any {
    const gregas = opcoes.map((opcao) => {
        //     v = Range("L" & i) / 100
        let difVCPVVD = (opcao.vcpvvd) / 100;

        return {
            //     pcel "N" & i, 100 * gamabs(s, x, r, v, t, 1)
            gamma: 100 * gamabs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
            //     pcel "O" & i, 100 * deltabs(s, x, r, v, t, 1)
            delta: 100 * deltabs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
            //     pcel "P" & i, tetabs(s, x, r, v, t, 1)
            theta: tetabs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
            //     pcel "Q" & i, 100 * vegabs(s, x, r, v, t, 1)
            vega: 100 * vegabs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
            //     pcel "R" & i, 100 * rhobs(s, x, r, v, t, 1)
            rho: 100 * rhobs(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
        }
    });

    return gregas;

    // backup
    // // s = Range("I14")
    // const s = justoDefault;
    // // r = Range("C11")
    // const r = taxaSelic;
    // // pcel "S13", s
    // // let gregas = [];
    // // let i = 15;
    // // For i = 15 To 42
    // for (i = 15; i < 42; i++) {
    //     //     t = Range("H" & i)
    //     const t = opcoes[i].diasUteis;

    //     //     If t <> "" Then
    //     if (t) {
    //         //     x = Range("aL" & i)
    //         const x = opcoes[i].strike;

    //         //     v = Range("L" & i) / 100
    //         const v = opcoes[i].vcpvvd / 100;

    //         //     pcel "N" & i, 100 * gamabs(s, x, r, v, t, 1)
    //         gregas[i].gamma = 100 * gamabs(s, x, r, v, t, 1);

    //         //     pcel "O" & i, 100 * deltabs(s, x, r, v, t, 1)
    //         gregas[i].delta = 100 * deltabs(s, x, r, v, t, 1);

    //         //     pcel "P" & i, tetabs(s, x, r, v, t, 1)
    //         gregas[i].theta = tetabs(s, x, r, v, t, 1);

    //         //     pcel "Q" & i, 100 * vegabs(s, x, r, v, t, 1)
    //         gregas[i].vega = 100 * vegabs(s, x, r, v, t, 1);

    //         //     pcel "R" & i, 100 * rhobs(s, x, r, v, t, 1)
    //         gregas[i].rho = 100 * rhobs(s, x, r, v, t, 1);

    //         //     Else
    //     } else {
    //         //     limpacel lc("N", i, "R", i)
    //         gregas[i].gamma = null;
    //         gregas[i].delta = null;
    //         gregas[i].theta = null;
    //         gregas[i].vega = null;
    //         gregas[i].rho = null;
    //         //     End If
    //     }

    //     //     cod = Range("A" & i)

    //     //     If cod = "" Then i = 186
    // }
    // // Next
}

/* ========== SHEET RELATED ========== */
function cgregasput(justoDefault, taxaSelic, opcoes): any {
    const gregasPut = opcoes.map((opcao) => {
        //     v = Range("L" & i) / 100
        let difVCPVVD = (opcao.vcpvvd) / 100;

        return {
            [opcao.codigo]: {
                //     pcel "N" & i, 100 * gamabs(s, x, r, v, t, 1)
                gamma: 100 * gamabsput(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
                //     pcel "O" & i, 100 * deltabs(s, x, r, v, t, 1)
                delta: 100 * deltabsput(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
                //     pcel "P" & i, tetabs(s, x, r, v, t, 1)
                theta: tetabsput(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
                //     pcel "Q" & i, 100 * vegabs(s, x, r, v, t, 1)
                vega: 100 * vegabsput(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
                //     pcel "R" & i, 100 * rhobs(s, x, r, v, t, 1)
                rho: 100 * rhobsput(justoDefault, opcao.strike, taxaSelic, difVCPVVD, opcao.diasUteis, 1),
            }
        };
    });

    return gregasPut;

    // backup
    // s = Range("I14")
    // r = Range("C11")
    // kv = Range("L11")
    // pcel "S13", s
    // For i = 43 To 180
    //     t = Range("H" & i)

    //     If t <> "" Then
    //     x = Range("aL" & i)
    //     v = Range("L" & i) / 100
    //     pcel "N" & i, 100 * gamabsput(s, x, r, v, t, 1)
    //     pcel "O" & i, 100 * deltabsput(s, x, r, v, t, 1)
    //     pcel "P" & i, tetabsput(s, x, r, v, t, 1)
    //     pcel "Q" & i, 100 * vegabsput(s, x, r, v, t, 1)
    //     pcel "R" & i, 100 * rhobsput(s, x, r, v, t, 1)

    //     Else
    //     limpacel lc("N", i, "R", i)
    //     End If
    //     cod = Range("A" & i)
    //     If cod = "" Then i = 186
    // Next
}

/* ========== SHEET RELATED ========== */
function cteorico(): void {
    // cgregas
    // 'If Month(Now) < 8 Then
    // cteovar
    // 'End If

    // cgregasput
    // 'If Month(Now) < 8 Then
    // cteovarput
    // 'End If
}

// linha 12 (CB ate CV): o que vai aparecer no grafico com 40% de queda (pelo visto usa a partgir do 30 apenas)
// linha 13 (CB ate CV): valores (cotaçao * )
// AE11 e Q11: nao achamos o que é

/* ========== SHEET RELATED ========== */
function recalc(): void { // ESSE PRINTA O GRAFICO
    // calcoff
    // lpc "N", "R"
    // lpc "AT", "AU"
    // lpc "BD", "BE"
    // lpc "BH", "BI"
    // lpc "BL", "EN"

    // pcel "U10", Range("J9")  // Printa em U10 a volatilidade
    // pcel "U11", Range("I14") // Printa em U11 o justoDefault

    // 'reorg
    // origem
    // cteorico
    // bkult

    // calcon
    // origem
}

/* ========== SHEET RELATED ========== */
// ' calcula valores teoricos
// cteovar
function chartDefault(options, justoDefault, strikeDefault, AE11 = 0, Q11 = 0, taxaSelic, volatilidadeManual, greeks, diasUteis): any {
    const { DT, TT, VG, RO } = greeks;

    const xValues = [-0.40, -0.30, -0.20, -0.15, -0.10, -0.07, -0.05, -0.03, -0.02, -0.01, 0.0, 0.01, 0.02, 0.03, 0.05, 0.07, 0.10, 0.15, 0.20, 0.25, 0.30];

    // const xValues = [0.02, 0.03, 0.05, 0.07, 0.10, 0.15, 0.20, 0.25];

    // AL14 - ativo base nao tem strike, tem? RESPOSTA: ele pega BK187, que eh o valor minimo da coluna BK (chamada ND) das opções envolvidas na simulaçao, que basicamente é o valor dos dias uteis da opçao. Ou seja, AL14 pega o menor d.ut dentre as opçoes envolvidas na simulação
    var t0 = Math.min(...options.filter(option => {
        return option.simulationAmount > 0;
    }).map(option => option.diasUteis));

    // sn = Range("AT14"): sp = Range("AU14")
    // -- DT (delta) = desvio num 1 (T6)
    var sn = justoDefault * (1 - DT); // (-)
    var sp = justoDefault * (1 - DT); // (+)

    // srn = Range("BD14"): srp = Range("BE14")
    var srn = justoDefault * (1 - AE11); // P.RN
    var srp = justoDefault * (1 + AE11); // P.RP

    // vrisc = Range("Q11")
    var vrisc = Q11;    // fica ao lado de "vol esperada +/-"

    // r = Range("C11"): kv = Range("J9")
    var r = taxaSelic;
    // var kv = kvManual;
    var kv = 0;

    // dspot = Range("O13"): ddia = Range("P13"): dvolat = Range("Q13"):: djuro = Range("R13")
    let chartValues = [];
    let results1 = [];
    let resultsFinal = [];

    let objectAux = null;
    let sumResults = [];

    xValues.map((x, index) => {
        let percentageChangeNumber = toFixedNumber(x, 2, 10);

        objectAux = {
            "percentageChange": percentageChangeNumber,
            "dia": 0,
            "vencimento": 0,
            "semana": 0,
            "index": index,
        }

        sumResults = [...sumResults, objectAux];
    });

    options.map((option) => {
        var vcpvvd = option.vcpvvd;

        if (option.diasUteis > 0) {
            results1 = [...results1, {
                [option.code]: {
                    // AT eh o (-)
                    at: callputbs(sn, option.strike, taxaSelic + RO, vldelta(vcpvvd, -DT, volatilidadeManual) + VG, option.diasUteis - TT, 1),
                    // AU eh o (+)
                    au: callputbs(sp, option.strike, taxaSelic + RO, vldelta(vcpvvd, DT, volatilidadeManual) + VG, option.diasUteis - TT, 1),
                    // BD eh o P.RN
                    bd: callputbs(srn, option.strike, taxaSelic, vldelta(vcpvvd, -vrisc, volatilidadeManual), option.diasUteis, 1),
                    // BE eh o P.RP
                    be: callputbs(srp, option.strike, taxaSelic, vldelta(vcpvvd, vrisc, volatilidadeManual), option.diasUteis, 1),
                    // BH eh o P.CTE
                    bh: callputbs(justoDefault, option.strike, taxaSelic + RO, vcpvvd, option.diasUteis - TT, 1),
                    // BI eh o P.CTEV
                    bi: callputbs(justoDefault, option.strike, taxaSelic + RO, vcpvvd + VG, option.diasUteis - TT, 1),
                }
            }];
        }

        if (option.diasUteis > 0 && option.simulationAmount > 0) {
            let j = 1;

            //     For j = 1 To 5
            if (false) {
                for (j; j <= 5; j++) {
                    //         dtp = Range(lc(cln, 13, "", 0))
                    /// BL13 = $H$10/4*(BL12-1)
                    let aux = ((j - 1) == 0) ? 1 : j;   // did this otherwise it will divide by 0
                    let dtp = diasUteis / 4 * (aux - 1);

                    chartValues = [...chartValues, {
                        [option.code]: {
                            "deviation": j,

                            // -- let cln = "BL";
                            //         pcel lc(cln, i, "", 0), qt * callputbs(srn, x, r, vldelta(v, -vrisc, kv), t - dtp, 1)
                            bl: option.simulationAmount * callputbs(srn, option.strike, r, vldelta(vcpvvd, -vrisc, kv), option.diasUteis - dtp, 1),

                            // -- let clc = "BQ";
                            //         pcel lc(clc, i, "", 0), qt * callputbs(s, x, r, v, t - dtp, 1)
                            bq: option.simulationAmount * callputbs(justoDefault, option.strike, r, vcpvvd, option.diasUteis - dtp, 1),

                            // -- let clp = "BV";
                            //         pcel lc(clp, i, "", 0), qt * callputbs(srp, x, r, vldelta(v, vrisc, kv), t - dtp, 1)
                            bv: option.simulationAmount * callputbs(srp, option.strike, r, vldelta(vcpvvd, vrisc, kv), option.diasUteis - dtp, 1),

                            //         cln = sc(cln): clc = sc(clc): clp = sc(clp)
                            // -- let cln = soma(BL);
                            // -- let clc = soma(BQ);
                            // -- let clp = soma(BV);

                            //     Next
                        }
                    }];
                }
            }

            //     clvc = "CB"
            // -- let clvc = "CB";

            //     cldia = "CX"
            // -- let cldia = "CX";

            //     clsem = "DT"
            // -- let clsem = "DT";

            //     For j = 1 To 21
            /// 21 é para ir de CB até CV
            xValues.map((x, index) => {
                //         sg = Range(lc(clvc, 13, "", 0))
                /// CB13 = $I$14*(1+CB12)
                let sg = justoDefault * (1 + x);

                //         pcg = Range(lc(clvc, 12, "", 0))
                // let pcg = "CB12";

                let ti = 0;
                //         If ddia * 5 < t0 Then ti = ddia * 5 Else ti = t0
                if ((TT * 5) < t0) {
                    ti = TT * 5;
                } else {
                    ti = t0;
                }

                let valuePaid = (option.lastPrice * option.simulationAmount);

                let percentageChange = `${(x * 100).toFixed(2)}%`;
                let percentageChangeNumber = toFixedNumber((x * 100), 2, 10);

                //         pcel lc(clvc, i, "", 0), qt * callputbs(sg, x, r, v, t - t0, 1)
                let vencimento = toFixedNumber((option.simulationAmount * callputbs(sg, option.strike, r, vcpvvd, option.diasUteis - t0, 1) - valuePaid), 2, 10);

                // TODO kv será um quoeficiente (por enquanto manter fixo em 0)
                //         pcel lc(cldia, i, "", 0), qt * callputbs(sg, x, r, vldelta(v, pcg, kv), t - ddia, 1)
                let dia = toFixedNumber((option.simulationAmount * callputbs(sg, option.strike, r, vldelta(vcpvvd, x, kv), option.diasUteis - TT, 1) - valuePaid), 2, 10);

                // TODO kv será um quoeficiente (por enquanto manter fixo em 0)
                //         pcel lc(clsem, i, "", 0), qt * callputbs(sg, x, r, vldelta(v, pcg, kv), t - ti, 1)
                let semana = toFixedNumber((option.simulationAmount * callputbs(sg, option.strike, r, vldelta(vcpvvd, x, kv), option.diasUteis - ti, 1) - valuePaid), 2, 10);

                chartValues = [...chartValues, {
                    percentageChange: percentageChangeNumber / 100,
                    percentageChangeFormatted: percentageChange,
                    'vencimento': vencimento,
                    'dia': dia,
                    'semana': semana,

                    //         clvc = sc(clvc)
                    // -- let clvc = soma(CB);
                    //         cldia = sc(cldia)
                    // -- let cldia = soma(CX);
                    //         clsem = sc(clsem)
                    // -- let clsem = soma(DT);

                    //     Next
                }];
            });

            resultsFinal = [...resultsFinal, {
                "code": option.code,
                "values": chartValues,
            }];
        }
    });

    let sumVencimento = 0;
    let sumDia = 0;
    let sumSemana = 0;

    // calculate sum of every option for each percentageChange
    let final = xValues.map((x, index) => {

        // console.log(`x: ${x} - index: ${index} - Vcto: ${resultsFinal[0].values[index].vencimento} - Dia: ${resultsFinal[0].values[index].dia} - Semana: ${resultsFinal[0].values[index].semana}`)

        sumVencimento = 0;
        sumDia = 0;
        sumSemana = 0;

        resultsFinal.forEach((option, i) => {
            sumVencimento += option.values[index].vencimento;
            sumDia += option.values[index].dia;
            sumSemana += option.values[index].semana;
        });

        return {
            percentageChange: x,
            vencimento: sumVencimento,
            dia: sumDia,
            semana: sumSemana,
        };
    });

    return final;
}

/* ========== SHEET RELATED ========== */
// ' calcula valores teoricos
function cteovarBackup(justoDefault, strikeDefault, DT, AE11, Q11, taxaSelic, volatilidadeManual, TT, VG, RO, numeroLinhas, opcao, qtSimulacao, BL13, CB13, CB12): void {
    // coluna S6
    const numDesvios = 1;

    const cb13 = [-40, -30, -20, -15, -10, -7, -5, -3, -2, -1, 0, 1, 2, 3, 5, 7, 10, 15, 20, 25, 30];

    // s = Range("I14"): t0 = Range("AL14")
    var s = justoDefault;
    // AL14 - ativo base nao tem strike, tem? RESPOSTA: ele pega BK187, que eh o valor minimo da coluna BK (chamada ND) das opções envolvidas na simulaçao, que basicamente é o valor dos dias uteis da opçao. Ou seja, AL14 pega o menor dia util dentre as opçoes envolvidas na simulação
    var t0 = strikeDefault;

    DT = numDesvios * (volatilidadeManual / Math.sqrt(252));

    // sn = Range("AT14"): sp = Range("AU14")
    // -- DT (delta) = desvio num 1 (T6)
    var sn = justoDefault * (1 - DT); // (-)
    var sp = justoDefault * (1 - DT); // (+)

    // srn = Range("BD14"): srp = Range("BE14")
    var srn = justoDefault * (1 - AE11); // P.RN
    var srp = justoDefault * (1 + AE11); // P.RP

    // vrisc = Range("Q11")
    var vrisc = Q11;    // fica ao lado de "vol esperada +/-"

    // r = Range("C11"): kv = Range("J9")
    var r = taxaSelic;
    var kv = volatilidadeManual;

    // dspot = Range("O13"): ddia = Range("P13"): dvolat = Range("Q13"):: djuro = Range("R13")
    var dspot = DT;
    var ddia = TT;
    var dvolat = VG;
    var djuro = RO;

    var i = 0;
    // For i = 15 To 42
    for (i; i <= numeroLinhas; i++) {
        //     t = Range("H" & i)
        let t = opcao[i].diasUteis;

        //     qt = Range("AC" & i)
        let qt = qtSimulacao;

        let chartValues = [];

        //     If t <> "" Then
        if (t > 0) {
            //     x = Range("AL" & i)
            var x = opcao[i].strikeOpcao;

            //     v = Range("L" & i) / 100
            var v = (opcao[i].vcpvvd) / 100;

            //     pcel "AT" & i, callputbs(sn, x, r + djuro, vldelta(v, -dspot, kv) + dvolat, t - ddia, 1)
            chartValues[i].at = callputbs(sn, x, r + djuro, vldelta(v, -dspot, kv) + dvolat, t - ddia, 1); // AT eh o (-)

            //     pcel "AU" & i, callputbs(sp, x, r + djuro, vldelta(v, dspot, kv) + dvolat, t - ddia, 1)
            chartValues[i].au = callputbs(sp, x, r + djuro, vldelta(v, dspot, kv) + dvolat, t - ddia, 1) // AT eh o (+)

            //     pcel "BD" & i, callputbs(srn, x, r, vldelta(v, -vrisc, kv), t, 1)
            chartValues[i].bd = callputbs(srn, x, r, vldelta(v, -vrisc, kv), t, 1)  // BD eh o P.RN

            //     pcel "BE" & i, callputbs(srp, x, r, vldelta(v, vrisc, kv), t, 1)
            chartValues[i].be = callputbs(srp, x, r, vldelta(v, vrisc, kv), t, 1)  // BD eh o P.RP

            //     pcel "BH" & i, callputbs(s, x, r + djuro, v, t - ddia, 1)
            chartValues[i].bh = callputbs(s, x, r + djuro, v, t - ddia, 1)  // BD eh o P.CTE

            //     pcel "BI" & i, callputbs(s, x, r + djuro, v + dvolat, t - ddia, 1)
            chartValues[i].bi = callputbs(s, x, r + djuro, v + dvolat, t - ddia, 1)  // BD eh o P.CTEV
            //     End If
        }

        //     If t <> "" And qt <> 0 Then
        if (t > 0 && qt != 0) {
            //     cln = "BL": clc = "BQ": clp = "BV"
            // -- let cln = "BL";
            // -- let clc = "BQ";
            // -- let clp = "BV";

            let j = 1;
            //     For j = 1 To 5
            for (j; j < 5; j++) {
                //         dtp = Range(lc(cln, 13, "", 0))
                let dtp = BL13;

                //         pcel lc(cln, i, "", 0), qt * callputbs(srn, x, r, vldelta(v, -vrisc, kv), t - dtp, 1)
                chartValues[i].bl = qt * callputbs(srn, x, r, vldelta(v, -vrisc, kv), t - dtp, 1);

                //         pcel lc(clc, i, "", 0), qt * callputbs(s, x, r, v, t - dtp, 1)
                chartValues[i].bq = qt * callputbs(s, x, r, v, t - dtp, 1);

                //         pcel lc(clp, i, "", 0), qt * callputbs(srp, x, r, vldelta(v, vrisc, kv), t - dtp, 1)
                chartValues[i].bv = qt * callputbs(srp, x, r, vldelta(v, vrisc, kv), t - dtp, 1);

                //         cln = sc(cln): clc = sc(clc): clp = sc(clp)
                // -- let cln = soma(BL);
                // -- let clc = soma(BQ);
                // -- let clp = soma(BV);

                //     Next
            }

            //     clvc = "CB"
            // -- let clvc = "CB";

            //     cldia = "CX"
            // -- let cldia = "CX";

            //     clsem = "DT"
            // -- let clsem = "DT";

            //     For j = 1 To 21
            /// 21 é para ir de CB até CV
            for (j = 1; j < 21; j++) {
                //         sg = Range(lc(clvc, 13, "", 0))
                let sg = "CB13";

                //         pcg = Range(lc(clvc, 12, "", 0))
                let pcg = "CB12";

                //         pcel lc(clvc, i, "", 0), qt * callputbs(sg, x, r, v, t - t0, 1)
                chartValues[i].cb = qt * callputbs(sg, x, r, v, t - t0, 1);

                //         pcel lc(cldia, i, "", 0), qt * callputbs(sg, x, r, vldelta(v, pcg, kv), t - ddia, 1)
                chartValues[i].cx = qt * callputbs(sg, x, r, vldelta(v, pcg, kv), t - ddia, 1);

                let ti = 0;
                //         If ddia * 5 < t0 Then ti = ddia * 5 Else ti = t0
                if ((ddia * 5) < t0) {
                    ti = ddia * 5;
                } else {
                    ti = t0;
                }

                //         pcel lc(clsem, i, "", 0), qt * callputbs(sg, x, r, vldelta(v, pcg, kv), t - ti, 1)
                chartValues[i].dt = qt * callputbs(sg, x, r, vldelta(v, pcg, kv), t - ti, 1);

                //         clvc = sc(clvc)
                // -- let clvc = soma(CB);
                //         cldia = sc(cldia)
                // -- let cldia = soma(CX);
                //         clsem = sc(clsem)
                // -- let clsem = soma(DT);

                //     Next
            }

            //     End If
        }

        //     cod = Range("A" & i)
        let cod = opcao[i].codigo;

        //     If cod = "" Then i = 186
        if (!cod) {
            i = numeroLinhas;
        }

        // Next
    }
}

/* ========== SHEET RELATED ========== */
// ' calcula valores teoricos
function cteovarput(justoDefault, strikeDefault, DT, AE11, Q11, taxaSelic, volatilidadeManual, TT, VG, RO, numeroLinhas, opcao, qtSimulacao, BL13, CB13, CB12): void {
    // s = Range("I14"): t0 = Range("AL14")
    var s = justoDefault;
    var t0 = strikeDefault;

    // sn = Range("AT14"): sp = Range("AU14")
    // -- DT (delta) = desvio num 1 (T6)
    var sn = justoDefault * (1 - DT); // (-)
    var sp = justoDefault * (1 - DT); // (+)

    // srn = Range("BD14"): srp = Range("BE14")
    var srn = justoDefault * (1 - AE11); // P.RN
    var srp = justoDefault * (1 + AE11); // P.RP

    // vrisc = Range("Q11")
    var vrisc = Q11;    // fica ao lado de "vol esperada +/-"

    // r = Range("C11"): kv = Range("J9")
    var r = taxaSelic;
    var kv = volatilidadeManual;

    // dspot = Range("O13"): ddia = Range("P13"): dvolat = Range("Q13"):: djuro = Range("R13")
    var dspot = DT;
    var ddia = TT;
    var dvolat = VG;
    var djuro = RO;

    var i = 0;
    // For i = 43 To 186
    for (i; i <= numeroLinhas; i++) {
        //     t = Range("H" & i)
        let t = opcao[i].diasUteis;

        //     qt = Range("AC" & i)
        let qt = qtSimulacao;

        let chartValues = [];

        //     If t <> "" Then
        if (t > 0) {
            //     x = Range("AL" & i)
            var x = opcao[i].strikeOpcao;

            //     v = Range("L" & i) / 100
            var v = (opcao[i].vcpvvd) / 100;

            //     pcel "AT" & i, putbs(sn, x, r + djuro, vldelta(v, -dspot, kv) + dvolat, t - ddia, 1)
            chartValues[i].at = putbs(sn, x, r + djuro, vldelta(v, -dspot, kv) + dvolat, t - ddia, 1); // AT eh o (-)

            //     pcel "AU" & i, putbs(sp, x, r + djuro, vldelta(v, dspot, kv) + dvolat, t - ddia, 1)
            chartValues[i].au = putbs(sp, x, r + djuro, vldelta(v, dspot, kv) + dvolat, t - ddia, 1) // AT eh o (+)

            //     pcel "BD" & i, putbs(srn, x, r, vldelta(v, -vrisc, kv), t, 1)
            chartValues[i].bd = putbs(srn, x, r, vldelta(v, -vrisc, kv), t, 1)  // BD eh o P.RN

            //     pcel "BE" & i, putbs(srp, x, r, vldelta(v, vrisc, kv), t, 1)
            chartValues[i].be = putbs(srp, x, r, vldelta(v, vrisc, kv), t, 1)  // BD eh o P.RP

            //     pcel "BH" & i, putbs(s, x, r + djuro, v, t - ddia, 1)
            chartValues[i].bh = putbs(s, x, r + djuro, v, t - ddia, 1)  // BD eh o P.CTE

            //     pcel "BI" & i, putbs(s, x, r + djuro, v + dvolat, t - ddia, 1)
            chartValues[i].bi = putbs(s, x, r + djuro, v + dvolat, t - ddia, 1)  // BD eh o P.CTEV

            //     End If
        }

        //     If t <> "" And qt <> 0 Then
        if (t > 0 && qt != 0) {
            //     cln = "BL": clc = "BQ": clp = "BV"
            // -- let cln = "BL";
            // -- let clc = "BQ";
            // -- let clp = "BV";

            let j = 1;
            //     For j = 1 To 5
            for (j; j < 5; j++) {
                //         dtp = Range(lc(cln, 13, "", 0))
                let dtp = BL13;

                //         pcel lc(cln, i, "", 0), qt * putbs(srn, x, r, vldelta(v, -vrisc, kv), t - dtp, 1)
                chartValues[i].bl = qt * putbs(srn, x, r, vldelta(v, -vrisc, kv), t - dtp, 1);

                //         pcel lc(clc, i, "", 0), qt * putbs(s, x, r, v, t - dtp, 1)
                chartValues[i].bq = qt * putbs(s, x, r, v, t - dtp, 1);

                //         pcel lc(clp, i, "", 0), qt * putbs(srp, x, r, vldelta(v, vrisc, kv), t - dtp, 1)
                chartValues[i].bv = qt * putbs(srp, x, r, vldelta(v, vrisc, kv), t - dtp, 1);

                //         cln = sc(cln): clc = sc(clc): clp = sc(clp)
                // -- let cln = soma(BL);
                // -- let clc = soma(BQ);
                // -- let clp = soma(BV);

                //     Next
            }

            //     clvc = "CB"
            // -- let clvc = "CB";

            //     cldia = "CX"
            // -- let cldia = "CX";

            //     clsem = "DT"
            // -- let clsem = "DT";

            //     For j = 1 To 21
            for (j = 1; j < 21; j++) {
                //         sg = Range(lc(clvc, 13, "", 0))
                let sg = CB13;

                //         pcg = Range(lc(clvc, 12, "", 0))
                let pcg = CB12;

                //         pcel lc(clvc, i, "", 0), qt * putbs(sg, x, r, v, t - t0, 1)
                chartValues[i].cb = qt * putbs(sg, x, r, v, t - t0, 1);

                //         pcel lc(cldia, i, "", 0), qt * putbs(sg, x, r, vldelta(v, pcg, kv), t - ddia, 1)
                chartValues[i].cx = qt * putbs(sg, x, r, vldelta(v, pcg, kv), t - ddia, 1);

                let ti = 0;
                //         If ddia * 5 < t0 Then ti = ddia * 5 Else ti = t0
                if ((ddia * 5) < t0) {
                    ti = ddia * 5;
                } else {
                    ti = t0;
                }

                //         pcel lc(clsem, i, "", 0), qt * putbs(sg, x, r, vldelta(v, pcg, kv), t - ti, 1)
                chartValues[i].dt = qt * putbs(sg, x, r, vldelta(v, pcg, kv), t - ti, 1);

                //         clvc = sc(clvc)
                // -- let clvc = soma(CB);
                //         cldia = sc(cldia)
                // -- let cldia = soma(CX);
                //         clsem = sc(clsem)
                // -- let clsem = soma(DT);

                //     Next
            }

            //     End If
        }

        //     cod = Range("A" & i)
        let cod = opcao[i].codigo;

        //     If cod = "" Then i = 186
        if (!cod) {
            i = numeroLinhas;
        }

        // Next
    }
}

/* ========== SHEET RELATED ========== */
// ' backup ultima cotação
function bkult(): void {
    // For i = 14 To 186
    //     Ult = Range("E" & i)
    //     If Ult <> "" Then
    //     pcel "AJ" & i, Ult
    //     End If
    // Next
}

/* ========== SHEET RELATED ========== */
function BK(): void {
    // sele = Range("A14")
    // Sheets(sele).Select

    // Range("A14:G186").Select: Selection.Copy
    // Sheets("BACK").Select: Range("A14").Select: ActiveSheet.Paste

    // Sheets(sele).Select
    // Range("Z14:AB186").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets("BACK").Select: Range("H14").Select: ActiveSheet.Paste

    // Sheets(sele).Select
    // Range("AJ14:AJ186").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets("BACK").Select: Range("L14").Select: ActiveSheet.Paste

    // Sheets(sele).Select
    // Range("AL15:AS186").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets("BACK").Select: Range("M15").Select: ActiveSheet.Paste


    // Sheets(sele).Select
    // Range("E2:E3").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets("BACK").Select: Range("B1").Select: ActiveSheet.Paste

    // Sheets(sele).Select
    // Range("D7:E7").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets("BACK").Select: Range("A3").Select: ActiveSheet.Paste

    // Sheets(sele).Select
    // Range("U10:U11").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets("BACK").Select: Range("C1").Select: ActiveSheet.Paste


    // Sheets(sele).Select
    // Range("A240:E289").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets("BACK").Select: Range("V15").Select: ActiveSheet.Paste

    // Sheets(sele).Select
    // Range("H240:I289").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets("BACK").Select: Range("AA15").Select: ActiveSheet.Paste


    // Sheets(sele).Select
}

/* ========== SHEET RELATED ========== */
function RST(): void {
    // sele = Range("A14")

    // Range("A14:G186").Select
    // Selection.Copy
    // Sheets(sele).Select: Range("A14").Select: ActiveSheet.Paste

    // Sheets("BACK").Select
    // Range("H14:J186").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets(sele).Select: Range("Z14").Select: ActiveSheet.Paste

    // Sheets("BACK").Select
    // Range("L14:L186").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets(sele).Select: Range("AJ14").Select: ActiveSheet.Paste

    // Sheets("BACK").Select
    // Range("M15:T186").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets(sele).Select: Range("AL15").Select: ActiveSheet.Paste

    // Sheets("BACK").Select
    // Range("B1:B2").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets(sele).Select: Range("E2").Select: ActiveSheet.Paste

    // Sheets("BACK").Select
    // Range("C1:C2").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets(sele).Select: Range("U10").Select: ActiveSheet.Paste

    // Sheets("BACK").Select
    // Range("A3:B3").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets(sele).Select: Range("D7").Select: ActiveSheet.Paste

    // Sheets("BACK").Select
    // Range("V15:Z64").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets(sele).Select: Range("A240").Select: ActiveSheet.Paste

    // Sheets("BACK").Select
    // Range("AA15:AB64").Select: Application.CutCopyMode = False: Selection.Copy
    // Sheets(sele).Select: Range("H240").Select: ActiveSheet.Paste
}

/* ========== SHEET RELATED ========== */
function gerbcpar(): void {
    // calcoff
    // If MsgBox("Gerar BroadCast", vbOKCancel) = vbOK Then
    //     pcel "D1", "BC"
    //     'lpc "B", "G"
    //     lpc "AL", "AN"
    //     p1 = "=(BC|COT!"
    //     p2 = "=sonum(BC|COT!"
    //     For i = 14 To 186
    //     cod = UCase(Range("A" & i))
    //     If cod <> "" Then
    //         If i > 14 Then
    //         pcel "AL" & i, p1 + cod + ".PEX)"
    //         pcel "AM" & i, p1 + cod + ".DVC)"
    //         pcel "AN" & i, p1 + cod + ".DUT)"
    //         End If
    //         If i = 14 Then
    //         cd = cod
    //         Else
    //         cd = UCase(cod)
    //         End If
    //         pcel "A" & i, cd
    //     End If
    //     Next
    // End If
    // calcon
}

/* ========== SHEET RELATED ========== */
function gerxp(): void {
    // 'gerar xp
    // calcoff
    // If MsgBox("Gerar Provedor", vbOKCancel) = vbOK Then
    //     limpacel "AJ14:AJ186"
    //     limpacel "AL15:AM186"
    //     limpacel "AP15:AQ186"
    //     pcel "D4", "Provedor"
    //     lpc "B", "G"
    //     lpc "AL"
    //     p1 = ".NEG"
    //     p2 = ".VOC"
    //     p3 = ".OCP"
    //     p4 = ".ULT"
    //     p5 = ".OVD"
    //     p6 = ".VOV"
    //     p7 = ".PEX"
    //     p8 = "=profitchart|cot!"
    //     p9 = ".VEN"
    //     p10 = "=SE(AM"
    //     p11 = "="";"";@DIASUT($E$7;$AM"
    //     p12 = ")-$H$9-AO"
    //     p13 = ")"

    //     For i = 14 To 186
    //     cod = UCase(Range("A" & i))
    //     If cod <> "" Then
    //         pcel "B" & i, p8 + cod + p1       'NEG
    //         pcel "C" & i, p8 + cod + p2   'QOC"
    //         pcel "D" & i, p8 + cod + p3   'OCP
    //         pcel "E" & i, p8 + cod + p4   'ULT
    //         pcel "F" & i, p8 + cod + p5   'OVD"
    //         pcel "G" & i, p8 + cod + p6   'QOV
    //         If i > 14 Then
    //         pcel "AP" & i, p8 + cod + p7   'PEX
    //         pcel "AQ" & i, p8 + cod + p9   'DVC
    //         End If
    //         If i = 14 Then
    //         cd = cod
    //         Else
    //         cd = UCase(cod)
    //         End If
    //         pcel "A" & i, cd
    //     End If
    //     Next
    //     pcel "H11", Empty
    //     copycol "AP", "AL"
    //     copycol "AQ", "AM"
    //     copycol "AR", "AN"

    //     origem
    // End If
    // calcon
}

/* ========== SHEET RELATED ========== */
function pendente(): void {
    // calcoff
    // copiavalor "AB11:AB183", "AA11"
    // origem
    // calcon
}

/* ========== SHEET RELATED ========== */
function preparar(): void {
    // 'preparar 5
    // calcoff
    // limpacel "G2:I8"
    // jp = 2
    // For i = 14 To 186
    //     cel = "AA" & i: qt = Range(cel)
    //     If qt <> 0 Then

    //     If qt > 0 Then
    //         'celv = "F" & i
    //         c = "F" & i: c = c + ":G" & i: colorn c, 8, 1: colorn lc("I", i, "M", i), 8, 1
    //     Else
    //         'celv = "D" & i
    //         c = "C" & i: c = c + ":D" & i: colorn c, 8, 1: colorn lc("I", i, "M", i), 8, 1
    //     End If
    //     colorn "A" & i, 8, 1: colorn "AA" & i, 8, 1

    //     ofer = Range("E" & i): If ofer = "" Then ofer = Range("I" & i)
    //     cod = Range("A" & i)
    //     pcel "G" & jp, UCase(cod)
    //     pcel "H" & jp, qt
    //     pcel "I" & jp, ofer
    //     If jp < 8 Then
    //         jp = jp + 1
    //     End If
    //     End If
    // Next
    // origem
    // calcon
}

/* ========== SHEET RELATED ========== */
function atualizar(): void {
    // 'atualizar 6
    // calcoff
    // copiavalor "AC14:AC186", "Z14"
    // For i = 14 To 186
    //     cel = "Z" & i: x = Range(cel): If x = 0 Then Range(cel).FormulaR1C1 = Empty
    //     qt = Range("AA" & i)
    //     qte = Range("AB" & i)
    //     If qte <> "" Then
    //     pcel "AB" & i, qte - qt
    //     End If
    // Next
    // For j = 2 To 8
    //     qt = Range("H" & j)
    //     If qt <> "" Then
    //     cod = Range("G" & j)
    //     unit = Range("I" & j)
    //     tot = qt * unit * 1000

    //     cp = Range("D7"): vd = Range("E7")
    //     If tot > 0 Then
    //         Range("D7").FormulaR1C1 = cp + tot
    //     Else
    //         Range("E7").FormulaR1C1 = vd - tot
    //     End If

    //     LIN = Range("FH13")

    //     k = LIN + 15
    //     pcel "FG" & k, Time
    //     pcel "FH" & k, cod
    //     pcel "FI" & k, qt
    //     pcel "FJ" & k, unit
    //     pcel "FK" & k, tot
    //     ka = k - 1
    //     acum = Range("FN" & ka) + tot
    //     Range("FN" & k).FormulaR1C1 = acum
    //     If tot > 0 Then
    //         Range("FL" & k).FormulaR1C1 = Range("FL" & ka) + tot
    //         Range("FM" & k).FormulaR1C1 = Range("FM" & ka)
    //     ElseIf tot < 0 Then
    //         Range("FL" & k).FormulaR1C1 = Range("FL" & ka)
    //         Range("FM" & k).FormulaR1C1 = Range("FM" & ka) + tot
    //     End If

    //     If LIN = 0 Then
    //         pcel "FG12", "DATA"
    //         pcel "FH12", Now()
    //         pcel "FG13", "N.OP"
    //         pcel "FG14", "HORA"
    //         pcel "FH14", "COD"
    //         pcel "FI14", "QT"
    //         pcel "FJ14", "UNIT"
    //         pcel "FK14", "TOT"
    //         pcel "FL14", "T.CP"
    //         pcel "FM14", "T.VD"
    //         pcel "FN14", "SALDO"
    //     End If

    //     LIN = LIN + 1
    //     pcel "FH13", LIN

    //     End If
    // Next
    // limpacel "AA14:AA186"
    // limpacel "G2:I8"
    // recalc
    // calcon
    // origem
}

/* ========== SHEET RELATED ========== */
function exsort(): void {
    // 'Sort'Sort
    // calcoff
    // If MsgBox("Ordenar Códigos", vbOKCancel) = vbOK Then
    //     unprotect
    //     For i = 15 To 186
    //     cod = Range("A" & i)
    //     If cod = "" Then
    //         limpacel lc("AL", i, "AO", i)
    //     End If
    //     Next

    //     copiavalor "A15:A186", "EY15"
    //     copiavalor "AL15:AM186", "EZ15"
    //     copiavalor "AO15:AO186", "FB15"
    //     copiavalor "Z15:AB186", "FC15"
    //     copiaformula "B15:G186", "FF15"
    //     copiavalor "AJ15:AJ186", "FL15"


    //     Range("EY15:FL186").Select


    //     Selection.Sort Key1:=Range("FA15"), Order1:=xlAscending, Key2:=Range( _
    //         "EZ15"), Order2:=xlAscending, Header:=xlGuess, OrderCustom:=1, MatchCase _
    //         :=False, Orientation:=xlTopToBottom, DataOption1:=xlSortNormal, _
    //         DataOption2:=xlSortNormal

    //     lpc "A", "G"
    //     copiavalor "EY15:EY186", "A15"
    //     copiavalor "EZ15:FA186", "AL15"
    //     copiavalor "FB15:FB186", "AO15"
    //     copiavalor "FC15:FE186", "Z15"
    //     copiaformula "FF15:FK186", "B15"
    //     copiavalor "FL15:FL186", "AJ15"

    //     limpacel "EY15:FL186"

    //     recalc
    //     cores
    //     protect
    //     origem
    // End If
    // calcon
}

/* ========== SHEET RELATED ========== */
function exundo(): void {
    // 'undo
    // calcoff
    // limpacel "G2:I8"
    // limpacel "AA14:AA186"
    // LIN = Range("FH13")
    // If LIN > 0 Then
    //     k = LIN + 14
    //     cod = Range("FH" & k)
    //     qt = Range("FI" & k)
    //     pr = Range("FJ" & k)
    //     tot = Range("FK" & k)

    //     pcel "G2", cod
    //     pcel "H2", qt
    //     pcel "I2", pr
    //     For i = 14 To 186
    //     codp = Range("A" & i)
    //     If codp = cod Then
    //         pcel "AA" & i, qt
    //         qta = Range("Z" & i)
    //         If qta = "" Then qta = 0
    //         qtp = qta - qt
    //         pcel "Z" & i, qtp
    //         i = 186
    //     End If
    //     Next

    //     cp = Range("D7"): vd = Range("E7")
    //     If tot > 0 Then
    //     Range("D7").FormulaR1C1 = cp - tot
    //     Else
    //     Range("E7").FormulaR1C1 = vd + tot
    //     End If

    //     pcel "FH13", LIN - 1
    //     limpacel lc("FG", k, "FN", k)
    //     If LIN = 1 Then
    //     limpacel "FG:FN"
    //     End If
    // End If
    // calcon
    // origem
}

/* ========== SHEET RELATED ========== */
function limpasim(): void {
    // 'undo
    // calcoff
    // limpacel "AA11:AA183"
    // calcon
    // origem
}

/* ========== SHEET RELATED ========== */
function exresumo(): void {
    // ' resumo
    // calcoff
    // limpacel "A240:E289"
    // limpacel "G240:G289"

    // j = 240
    // k = 2
    // For i = 11 To 183
    //     qt = Range("Z" & i)
    //     If qt <> 0 Then
    //     cod = Range("A" & i)
    //     vc = Range("AM" & i)
    //     Pex = Range("AL" & i)
    //     unit = Range("E" & i)
    //     If unit = "" Then
    //         unit = Range("AJ" & i)
    //     End If
    //     tot = unit * qt * 1000
    //     pcel "A" & j, cod
    //     pcel "B" & j, qt * 1000
    //     pcel "C" & j, vc
    //     pcel "D" & j, Pex
    //     pcel "E" & j, unit
    //     If unit = 0 Then
    //         pcel "G" & k, cod
    //         If k < 8 Then k = k + 1
    //     End If
    //     j = j + 1
    //     End If
    // Next

    // ActiveSheet.unprotect


    // Range("A240:E289").Select
    // Selection.Sort Key1:=Range("A240"), Order1:=xlAscending, Header:=xlNo, _
    //     OrderCustom:=1, MatchCase:=False, Orientation:=xlTopToBottom, _
    //     DataOption1:=xlSortNormal

    // ActiveSheet.protect DrawingObjects:=True, Contents:=True, Scenarios:=True _
    //     , AllowFormattingCells:=True

    // Range("A239").Select
    // 'calcon
}

/* ========== SHEET RELATED ========== */
function recresumo(): void {
    // ' Recompor do resumo
    // calcoff
    // origem
    // limpacel "G240:G289"
    // limpacel "Z14:Z186"
    // For i = 240 To 289
    //     codc = Range("A" & i)
    //     rs = "N"
    //     If codc = "" Then
    //     i = 289
    //     Else
    //     qt = Range("B" & i) / 1000
    //     pu = Range("E" & i)
    //     For j = 14 To 186
    //         codp = Range("A" & j)
    //         If codc = codp Then
    //         pcel "Z" & j, qt
    //         'pcel "AJ" & j, pu
    //         j = 186
    //         rs = "OK"
    //         End If
    //     Next
    //     pcel "G" & i, rs
    //     End If
    // Next
    // ' origem
    // ' Range("A239").Select
    // recalc
    // calcon
}

/* ========== SHEET RELATED ========== */
function calcdiasut(): void {
    // calcoff
    // limpacol "AN"
    // calcoff
    // hj = Range("E7")
    // For i = 12 To 183
    //     dvc = Range("AM" & i)
    //     x = VarType(dvc)
    //     nf = Range("AO" & i)
    //     If nf <> "" And VarType(dvc) <> 8 Then
    //     ncalc = diasut(hj, dvc)
    //     du = ncalc - nf
    //     pcel "AN" & i, du
    //     End If
    // Next
    // calcon
}

/* ========== SHEET RELATED ========== */
function ajustndata(): void {
    // ' AJUSTA N CONFORME DATA
    // calcoff
    // coda = Left(Range("A12"), 5)
    // dta = Range("AQ12")
    // nda = Range("AR12")
    // nfa = Range("AS12")
    // For i = 12 To 183
    //     cod = Left(Range("A" & i), 5)
    //     dt = Range("AQ" & i)
    //     nd = Range("AR" & i)
    //     n = VarType(nd)
    //     If (n = 8 Or nd = "" Or nd = 0) And cod = coda Then
    //     pcel "AQ" & i, dta
    //     pcel "AR" & i, nda
    //     cod = coda
    //     dt = dta
    //     nd = nda
    //     End If

    //     nf = Range("AS" & i)
    //     If nf = "" And cod = coda Then
    //     pcel "AS" & i, nfa
    //     nf = nfa
    //     End If

    //     coda = cod
    //     dta = dt
    //     nda = nd
    //     nfa = nf
    // Next

    // coda = Left(Range("A183"), 5)
    // dta = Range("AQ183")
    // nda = Range("AR183")
    // nfa = Range("AS183")
    // For i = 183 To 12 Step -1
    //     cod = Left(Range("A" & i), 5)
    //     dt = Range("AQ" & i)
    //     nd = Range("AR" & i)
    //     n = VarType(nd)
    //     If (n = 8 Or nd = "" Or nd = 0) And cod = coda Then
    //     pcel "AQ" & i, dta
    //     pcel "AR" & i, nda
    //     cod = coda
    //     dt = dta
    //     nd = nda
    //     End If

    //     nf = Range("AS" & i)
    //     If nf = "" And cod = coda Then
    //     pcel "AS" & i, nfa
    //     nf = nfa
    //     End If

    //     coda = cod
    //     dta = dt
    //     nda = nd
    //     nfa = nf
    // Next i
    // calcon
}

/* ========== SHEET RELATED ========== */
function exabertura(): void {
    // 'abertura 1
    // calcoff
    // If MsgBox("Abertura", vbOKCancel) = vbOK Then
    //     limpacel "AA14:AA186"
    //     limpacel "FF:FN"
    //     'limpacel "AJ14:AJ186"
    //     copiavalor "F2:F3", "E2"
    //     pcel "D7:E7", Empty
    //     pcel "G2:I8", Empty
    //     origem
    // End If
    // pcel "H14", Empty
    // calcon
}

/* ========== SHEET RELATED ========== */
function volat0(): void {
    // calcoff
    // m = Minute(Now)
    // If m < 59 Then
    //     Range("J187").GoalSeek Goal:=0, ChangingCell:=Range("U10")
    // End If
    // calcon
}

/* ========== SHEET RELATED ========== */
function decdias(): void {
    // 'Decremento num dias
    // calcoff
    // pcel "AU9", Range("E10")
    // pcel "F11", Int(Range("AU9") - 1)
    // calcon
}

/* ========== SHEET RELATED ========== */
function incdias(): void {
    // 'Incremento num Dias
    // calcoff
    // pcel "AU9", Range("E10")
    // pcel "F11", Int(Range("AU9") + 1)
    // calcon
}

/* ========== SHEET RELATED ========== */
function decfer(): void {
    // 'Decremento num feriados
    // calcoff
    // For i = 15 To 183
    //     nd = Range("AS" & i)
    //     If nd <> "" Then
    //     nd = nd - 1
    //     pcel "AS" & i, nd
    //     End If
    // Next
    // calcon
}

/* ========== SHEET RELATED ========== */
function incfer(): void {
    // 'Incremento num feriados
    // calcoff
    // For i = 15 To 183
    //     nd = Range("AS" & i)
    //     If nd <> "" Then
    //     nd = nd + 1
    //     pcel "AS" & i, nd
    //     End If
    // Next
    // calcon
}

/* ========== SHEET RELATED ========== */
function gerfer(): void {
    // limpacol "AO"
    // calcoff
    // hj = Range("E10")
    // For i = 15 To 183
    //     dvc = Range("AM" & i)
    //     nsis = Range("AN" & i)
    //     If nsis > 0 And VarType(nsis) = 5 Then
    //     ncalc = diasut(hj, dvc)
    //     fer = ncalc - nsis
    //     pcel "AO" & i, fer
    //     End If
    // Next
    // calcon
}

/* ========== SHEET RELATED ========== */
function inccot(): void {
    // 'Incremento Cotação
    // calcoff
    // pcel "AU8", Range("L9")
    // pcel "L9", (Int(Range("AU8") * 100) * 1.005) / 100
    // calcon
}

/* ========== SHEET RELATED ========== */
function deccot(): void {
    // 'decremento Cotação
    // calcoff
    // pcel "AU8", Range("L9")
    // pcel "L9", (Int(Range("AU8") * 100) * 0.995) / 100
    // calcon
}

/* ========== SHEET RELATED ========== */
function conferirexe(): void {
    // calcoff
    // For i = 12 To 183
    //     v1 = Range("AL" & i)
    //     v2 = Range("AP" & i)
    //     If v1 <> v2 Then
    //     colorn "AP" & i, 6, 1
    //     End If
    // Next
    // calcon
}

/* ========== SHEET RELATED ========== */
function completar(): void {
    // calcoff
    // For i = 15 To 186
    //     vc = Range("AP" & i)
    //     n = VarType(vc)
    //     If n <> 5 Or vc = 0 Then
    //     vc = Range("AL" & i)
    //     n = VarType(vc)
    //     If n = 5 Then
    //         pcel "AP" & i, vc
    //         pcel "AQ" & i, Range("AM" & i)
    //     End If
    //     End If
    // Next
    // calcon
}

/* ========== SHEET RELATED ========== */
// ' recuperar parametros
function recparam(): void {
    // calcoff
    // If MsgBox("Recuperar Parametros", vbOKCancel) = vbOK Then
    //     copiavalor "AP15:AS186", "AL15"
    //     pcel "H14", Empty
    //     'origem
    // End If
    // calcon
}

/* ========== SHEET RELATED ========== */
function inselim(): void {
    // calcoff
    // For i = 12 To 183
    //     cod = Range("AA" & i)
    //     If cod = "E" Or cod = "e" Then
    //     limpacel lc("C", i, "G", 186)
    //     copiavalor lc("A", i + 1, "A", 186), "A" & i
    //     copiavalor lc("Z", i + 1, "AA", 186), "Z" & i
    //     copiavalor lc("AL", i + 1, "AR", 186), "AL" & i

    //     limpacel "A" & 186
    //     limpacel lc("Z", 186, "AA", 186)
    //     i = 186
    //     ElseIf cod = "I" Or cod = "i" Then
    //     limpacel "AA" & i
    //     limpacel lc("C", i, "G", 186)
    //     copiavalor lc("A", i, "A", 186 - 1), lc("A", i + 1, "", 0)
    //     copiavalor lc("Z", i, "AA", 186 - 1), lc("Z", i + 1, "", 0)
    //     copiavalor lc("AL", i, "AR", 186 - 1), lc("AL", i + 1, "", 0)
    //     limpacel "A" & i
    //     limpacel "Z" & i
    //     i = 186
    //     End If
    // Next
    // origem
    // calcon
}

/* ========== SHEET RELATED ========== */
function invqt(): void {
    // 'inverter quantidade
    // calcoff
    // lpc "AA"
    // dta = Range("AM14")
    // For i = 15 To 186
    //     dtex = Range("AM" & i)
    //     If dta = dtex Then
    //     qt = Range("Z" & i)
    //     If qt = "" Then q = Empty Else q = -qt
    //     pcel "AA" & i, q
    //     Else
    //     i = 186
    //     End If
    // Next
    // origem
    // calcon
}

/* ========== SHEET RELATED ========== */
function beepon(): void {
    // A = Range("AB11")
    // If A = "ON" Then
    //     A = "OFF"
    // Else
    //     A = "ON"
    //     Beep
    // End If
    // pcel "AB11", A
}

/* ========== SHEET RELATED ========== */
function limparop(): void {
    // 'limpa operações
    // calcoff
    // 'lpc "AA"
    // limpacel "AA14:AA186"
    // limpacel "G2:I8"
    // limpacel "L9"
    // origem
    // calcon
}

/* ========== SHEET RELATED ========== */
function vdwm(): void {
    // calcoff
    // pcel "U10", Range("J9")
    // pcel "U11", Range("I14")
    // pcel "J9", Int((Range("U10") * 2 - 0.005) * 100) / 200
    // calcon
}

/* ========== SHEET RELATED ========== */
function vupm(): void {
    // calcoff
    // pcel "U10", Range("J9")
    // pcel "U11", Range("I14")
    // pcel "J9", Int((Range("U10") * 2 + 0.011) * 100) / 200
    // calcon
}

/* ========== SHEET RELATED ========== */
function limpares(): void {
    // limpacel "H240:I289"
    // Range("H240").Select
}

/* ========== SHEET RELATED ========== */
function petr4(): void {
    // Sheets("PETR4").Select
}

/* ========== SHEET RELATED ========== */
function vale5(): void {
    // Sheets("VALE5").Select
}

/* ========== SHEET RELATED ========== */
function pcot(): void {
    // c = Range("L9")
    // If c = "" Then
    //     pcel "L9", Range("E14")
    // Else
    //     pcel "L9", Range("L9")
    // End If
}

/* ========== SHEET RELATED ========== */
function Executar(): void {
    // If Tecla = 113 Then
    //     CommandButton80
    // End If
}

export { origem, origem0, copycol, limpacol, limpacor, crc, czc, lpc, opv, historico, corotm, corcrt, corpend, limpager, cgregas, cgregasput, cteorico, recalc, chartDefault, cteovarput, bkult, BK, RST, gerbcpar, gerxp, pendente, preparar, atualizar, exsort, exundo, limpasim, exresumo, recresumo, calcdiasut, ajustndata, exabertura, volat0, decdias, incdias, decfer, incfer, gerfer, inccot, deccot, conferirexe, completar, recparam, inselim, invqt, beepon, limparop, vdwm, vupm, limpares, petr4, vale5, pcot, Executar };
