import { AppError } from "@shared/errors/AppError";
import { secante } from "./module1";
import { callputbs, putbs, vextr } from "./module2";
import { isNumeric } from "./numbersHandler";

// DONE
// ' volatilidade implicita
function vlibs(cot, s, x, r, t, cp) {
    var result = null;

    // cot0 = callputbs(s, x, r, 0.00001, t, cp)
    const cot0 = callputbs(s, x, r, 0.00001, t, cp);

    // cots = callputbs(s, x, r, 9, t, cp)
    const cots = callputbs(s, x, r, 9, t, cp);

    // throw new AppError(`cot = ${cot} || cot0 = ${cot0} || cots = ${cots} || s = ${s} || x = ${x} || r = ${r} || t = ${t} || cp = ${cp}`)

    // If cot = "" Or cot < cot0 Then
    if (!cot || (cot < cot0)) {
        //     vlibs = 0
        result = 0;
    } else if (cot > cots) {    // ElseIf cot > cots Then
        //     vlibs = 9
        result = 9;
    } else {    // Else
        //     n = 1
        var n = 1;

        //     v1 = 0.8: v2 = 1.5
        var v1 = 0.8;
        var v2 = 1.5;

        //     y1 = callputbs(s, x, r, v1, t, cp) - cot
        var y1 = callputbs(s, x, r, v1, t, cp) - cot;

        //     y2 = callputbs(s, x, r, v2, t, cp) - cot
        var y2 = callputbs(s, x, r, v2, t, cp) - cot;

        var v = null;
        var y = null;

        //     While Abs(v1 - v2) > 0.001 And n < 20
        while ((Math.abs(v1 - v2) > 0.001) && (n < 20)) {
            //     v = secante(v1, y1, v2, y2)
            v = secante(v1, y1, v2, y2);

            //     y = callputbs(s, x, r, v, t, cp) - cot
            y = callputbs(s, x, r, v, t, cp) - cot;

            //     v1 = v2: y1 = y2
            v1 = v2;
            y1 = y2

            //     v2 = v: y2 = y
            v2 = v;
            y2 = y;

            //     n = n + 1
            n = n + 1;
        }

        //     v = secante(v1, y1, v2, y2)
        v = secante(v1, y1, v2, y2);
        //     vlibs = v

        result = v;
    }

    return result;
}

// DONE
// ' volatilidade implicita
function vlibsput(cot, s, x, r, t, cp) {
    var result = null;

    //   cot0 = putbs(s, x, r, 0.00001, t, cp)
    const cot0 = putbs(s, x, r, 0.00001, t, cp);

    //   cots = putbs(s, x, r, 9, t, cp)
    const cots = putbs(s, x, r, 9, t, cp);

    //   If cot = "" Or cot < cot0 Then
    if (cot == "" || cot < cot0) {
        //     vlibsput = 0
        result = 0;
    } else if (cot > cots) {    //   ElseIf cot > cots Then
        //     vlibsput = 9
        result = 9;
    } else {    //   Else
        //     n = 1
        var n = 1;

        //     v1 = 0.8: v2 = 1.5
        var v1 = 0.8;
        var v2 = 1.5;

        //     y1 = putbs(s, x, r, v1, t, cp) - cot
        var y1 = putbs(s, x, r, v1, t, cp) - cot;

        //     y2 = putbs(s, x, r, v2, t, cp) - cot
        var y2 = putbs(s, x, r, v2, t, cp) - cot;

        var v = null;
        var y = null;

        //     While Abs(v1 - v2) > 0.001 And n < 20
        while ((Math.abs(v1 - v2) > 0.001) && (n < 20)) {
            //       v = secante(v1, y1, v2, y2)
            v = secante(v1, y1, v2, y2);

            //       y = putbs(s, x, r, v, t, cp) - cot
            y = putbs(s, x, r, v, t, cp) - cot;

            //       v1 = v2: y1 = y2
            v1 = v2;
            y1 = y2;

            //       v2 = v: y2 = y
            v2 = v;
            y2 = y;

            //       n = n + 1
            n = n + 1;
        }

        //     v = secante(v1, y1, v2, y2)
        v = secante(v1, y1, v2, y2);

        //     vlibsput = v
        result = v;
    }

    return result;
}

// DONE
/* ========== MAYBE SHEET RELATED ========== */
// ' volatilidade implicita 100
function vliz(vr, cot, s, x, r, t, cp) {
    var result = null;

    var v = null;

    // If cot = "" Then v = 0 Else v = 100 * vlibs(cot, s, x, r, t, cp)
    if (!cot) {
        v = 0;
    } else {
        v = 100 * vlibs(cot, s, x, r, t, cp);
    }

    // If vr = "" Then vr = 0
    if (!vr) {
        vr = 0;
    }

    // If v < vr Then v = -v
    if (v < vr) {
        v = v * -1;
    }

    // If v = 0 Then vliz = "." Else vliz = v
    if (v == 0) {
        result = null;
    } else {
        result = v;
    }

    return result;
}

// DONE
// ' volatilidade implicita 100
function vlizput(vr, cot, s, x, r, t, cp) {
    var result = null;

    var v = null;
    // If cot = "" Then v = 0 Else v = 100 * vlibsput(cot, s, x, r, t, cp)
    if (cot == "") {
        v = 0;
    } else {
        v = v = 100 * vlibsput(cot, s, x, r, t, cp)
    }

    // If vr = "" Then vr = 0
    if (vr == "") {
        vr = 0;
    }

    // If v < vr Then v = -v
    if (v < vr) {
        v = v * -1;
    }

    // If v = 0 Then vlizput = "." Else vlizput = v
    if (v == 0) {
        result = ".";
    } else {
        result = v;
    }

    return result;
}

// DONE
// ' valor extrincico percentual
function vextrpc(ct, s, x, cp) {
    var result = null;

    // vextrpc = vextr(ct, s, x, cp) / ct
    result = vextr(ct, s, x, cp) / ct;

    return result;
}

// DONE
function corret(op, desc) {
    var result = null;

    // If op < 135.06 Then
    if (op < 135.06) {
        //     If op > 0 Then
        if (op > 0) {
            //     corret = 2.7
            result = 2.7;
        } else {    //     Else
            //     corret = 0
            result = 0;
        }
    } else {    // Else
        //     If op < 498.62 Then
        if (op < 498.62) {
            //     corret = op * 0.02
            result = op * 0.02;
        } else {    //     Else
            //     If op < 1514.69 Then
            if (op < 1514.69) {
                //  corret = op * 0.015 + 2.49
                result = op * 0.015 + 2.49;
            } else {    //     Else
                //         If op < 3029.38 Then
                if (op < 3029.38) {
                    //         corret = op * 0.01 + 10.06
                    result = op * 0.01 + 10.06;
                } else {    //         Else
                    //         corret = op * 0.005 + 25.21
                    result = op * 0.005 + 25.21;
                }
            }
        }
    }

    // corret = corret * (1 - desc)
    result = result * (1 - desc);

    return result;
}

// DONE
// ' diferenças ofertas
function difof(ocp, ovd, pjs, s) {
    var result = null;

    // If ocp = "" Then ocp = 0
    if (ocp == "") {
        ocp = 0;
    }

    // If ovd = "" Then ovd = 0
    if (ovd == "") {
        ovd = 0;
    }

    // If ovd <> "" And ovd <> 0 And ovd < pjs Then
    if (ovd != "" && ovd != 0 && ovd < pjs) {
        //     difof = (ovd - pjs) * 10000 / s
        result = (ovd - pjs) * 10000 / s;
    } else if (ocp != "" && ocp != 0 && ocp > pjs) {    // ElseIf ocp <> "" And ocp <> 0 And ocp > pjs Then
        //     difof = (ocp - pjs) * 10000 / s
        result = (ocp - pjs) * 10000 / s;
    } else {    // Else
        //     difof = ""
        result = "";
    }

    return result;
}

// DONE
// ' variação da volatilidade em função do delta
function vldelta(v, d, kv) {
    var result = null;

    // va = v
    var va = v;
    var vldelta = null;

    // If d < 0 Then
    if (d < 0) {
        //     If v > 0.7 Then
        if (v > 0.7) {
            //     vldelta = v
            vldelta = v;
        } else {   //     Else
            //     vldelta = v - d * kv
            vldelta = v - d * kv;

            //     If vldelta > 0.7 Then vldelta = 0.7
            if (vldelta > 0.7) {
                vldelta = 0.7;
            }
        }
    } else {    // Else
        //     If v < 0.2 Then
        if (v < 0.2) {
            //     vldelta = v
            vldelta = v;

        } else { //     Else
            //     vldelta = v - d * kv
            vldelta = v - d * kv;

            //     If vldelta < 0.2 Then vldelta = 0.2
            if (vldelta < 0.2) {
                vldelta = 0.2;
            }
        }
    }

    result = vldelta;

    return result;
}

// DONE
/* ========== MAYBE SHEET RELATED ========== */
// ' apresenta somente numero
function sonum(n) {
    var result = null;
    var sonum = null;

    // If VarType(n) = 5 Then   // <- checks if it's tibe vbDouble
    if (isNumeric(n)) {
        //     sonum = n
        sonum = n;
    } else {    // Else
        //     sonum = ""
        sonum = "";
    }

    result = sonum;

    return result;
}

/* ========== MAYBE SHEET RELATED ========== */
// ' converte data cma
function dtcma(dt) {
    // If VarType(dt) = 5 Then
    //     d = Str(dt)
    //     If Len(d) = 9 Then
    //     dtano = Left(d, 5)
    //     dtmes = Mid(d, 6, 2)
    //     dtdia = Right(d, 2)
    //     dtcma = DateSerial(dtano, dtmes, dtdia)
    //     Else
    //     dtcma = "N"
    //     End If
    // End If
}

/* ========== MAYBE SHEET RELATED ========== */
function som(lim, d1, d2, dneg, dtet, dpos, onoff) {
    // s = ""
    // If d1 > lim Then
    //     s = "VENDER"
    // ElseIf d2 > lim Then
    //     s = "COMPRAR"
    // End If
    // If s <> "" And onoff = "ON" Then
    //     Beep
    // End If
    // som = s
}


export { vlibs, vlibsput, vliz, vlizput, vextrpc, corret, difof, vldelta, sonum, dtcma, som };
