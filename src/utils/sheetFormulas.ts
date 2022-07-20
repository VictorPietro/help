import { AppError } from "@shared/errors/AppError";
import { deltabsv, vsmile } from "./module2";
import { vliz } from "./module3";

/* ========== RED ========== */

// TOREMOVE CORRIGIDO OK
// $I$14 =IF(L9="";IF(OR(D14="";F14="");E14;(D14+F14)/2);L9)
function justoDefault(ocp, ovd, ult) {
    var result = null;

    if (!ocp || !ovd) {
        result = ult;
    } else {
        result = (ocp + ovd) / 2;
    }

    return result;
}

// L15 =IF(H15="";"";VSMILE($J$9;$L$10;$J$10;$J$11;$I$14; $AL15; H15; 1))
function ratioVCPVVD(diasUteis, customVol, kd, ka, kt, justoDefault, strike) {
    var result = null;

    if (diasUteis) {
        result = vsmile(customVol, kd, ka, kt, justoDefault, strike, diasUteis, 1);
    }

    return result;
}

// K15 =IF($D15=0;"";VLIZ($L15;D15;$I$14; AL15; $C$11; H15; 1))
function VCP(difVCPVVD, ocp, justoDefault, strike, taxaJuros, diasUteis) {
    var result = null

    if (ocp) {
        result = vliz(difVCPVVD, ocp, justoDefault, strike, taxaJuros, diasUteis, 1);
    }

    // throw new AppError(`difVCPVVD = ${difVCPVVD} || ocp = ${ocp} || justoDefault = ${justoDefault} || strike = ${strike} || taxaJuros = ${taxaJuros} || diasUteis = ${diasUteis} || result = ${result}`)

    return result;
}

// M15 =IF($F15=0;"";VLIZ($L15;F15;$I$14; AL15; $C$11; H15; 1))
function VVD(ovd, difVCPVVD, justoDefault, strike, taxaJuros, diasUteis) {
    var result = null

    if (ovd) {
        result = vliz(difVCPVVD, ovd, justoDefault, strike, taxaJuros, diasUteis, 1);
    }

    return result;
}

// S15 =IF(H15="";"";DELTABSV($I$14; $AL15;$C$11;$L15/100;$H15; 1;$L$11))
function DTV(diasUteis, justoDefault, strike, taxaJuros, difVCPVVD, kv) {
    var result = null

    if (diasUteis) {
        result = deltabsv(justoDefault, strike, taxaJuros, (difVCPVVD / 100), diasUteis, 1, kv);
    }

    return result;
}

/* ==========  END RED ========== */

// AW15 =IF(S15="";"";AC15*S15/10)
function TDELTA(dtv, customQtd) { // T.DELT
    var result = null;

    if (dtv) {
        result = customQtd * dtv;
    }

    return result;
}

// AX15 =IF(H15="";"";AC15*N15/10)
function TGAMA(customQtd, gama) { // T.GAMA
    var result = null;

    result = (customQtd * gama) / 10;

    return result;
}

// AY15 =IF(H15="";"";AC15*P15)
function TTHETA(customQtd, theta) { // T.THETA
    var result = null;

    result = customQtd * theta;

    return result;
}

export { justoDefault, ratioVCPVVD, VCP, VVD, DTV, TDELTA, TGAMA, TTHETA };
