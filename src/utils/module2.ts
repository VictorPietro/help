import { AppError } from "@shared/errors/AppError";
import { distn } from "./module1";
import { vldelta } from "./module3";

// DONE
// customVol, kd, ka, kt, justoDefault, strike, diasUteis, 1
function vsmile(v, kd, ka, kt, s, x, t, cp) {
    var result = null;
    // If t <> "" Then
    if (t) {
        //     dvl = kd * t ^ 0.7 * s / 60
        const dvl = kd * t ** 0.7 * s / 60;

        //     avl = ka * 0.3 / (t + 4)
        const avl = ka * 0.3 / (t + 4);

        //     dvt = (v - 0.1) * kt * t ^ 0.5 / 25
        const dvt = (v - 0.1) * kt * t ** 0.5 / 25;

        //     vsmile = 100 * (Sqr(((x - s - cp * dvl) * 8 / s) ^ 2 * avl + v ^ 2) - dvt)
        result = 100 * (Math.sqrt(((x - s - cp * dvl) * 8 / s) ** 2 * avl + v ** 2) - dvt);

        // throw new AppError(`v (customVol) = ${v} || kd = ${kd} || ka = ${ka} || kt = ${kt} || s (justoDefault) = ${s} || x (strike) = ${x} || t (diasUteis) = ${t} || cp (1) = ${cp} || dvl = ${dvl} || avl = ${avl} || dvt = ${dvt} || result = ${result}`);
    } else {    // Else
        //     vsmile = 0
        result = 0;
    }

    return result;
}

// DONE
function vsmileput(v, kd, ka, kt, s, x, t, cp) {
    var result = null;

    // If t <> "" Then
    if (t) {
        //     dvl = kd * t ^ 0.7 * s / 60
        const dvl = kd * t ** 0.7 * s / 60;

        //     avl = ka * 0.3 / (t + 4)
        const avl = ka * 0.3 / (t + 4);

        //     dvt = (v - 0.1) * kt * t ^ 0.5 / 25
        const dvt = (v - 0.1) * kt * t ** 0.5 / 25;

        //     vsmileput = 100 * (Sqr(((x - s - cp * dvl) * 8 / s) ^ 2 * avl + v ^ 2) - dvt)
        result = 100 * (Math.sqrt(((x - s - cp * dvl) * 8 / s) ** 2 * avl + v ** 2) - dvt);
    } else {    // Else
        //     vsmileput = 0
        result = 0;
    }

    return result;
}

// DONE
// ' delta com volatilidade
function deltabsv(s, x, r, v, t, cp, kv) {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        //     deltabsv = 1
        result = 1;
    } else {    // Else
        //     sn = s / 1.01: sp = s * 1.01
        const sn = s / 1.01;
        const sp = s * 1.01;

        //     dn = callputbs(sn, x, r, vldelta(v, -0.01, kv), t, cp)
        const dn = callputbs(sn, x, r, vldelta(v, -0.01, kv), t, cp);

        //     dp = callputbs(sp, x, r, vldelta(v, 0.01, kv), t, cp)
        const dp = callputbs(sp, x, r, vldelta(v, 0.01, kv), t, cp);

        //     deltabsv = (dp - dn) / s * 100 / 2
        result = (dp - dn) / s * 100 / 2;
    }

    return result;
}

// DONE
// ' delta com volatilidade
function deltabsvput2(s, x, r, v, t, cp, kv) {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        //     deltabsvput2 = 1
        result = 1;
    } else {    // Else
        //     sn = s / 1.01: sp = s * 1.01
        const sn = s / 1.01;
        const sp = s * 1.01;

        //     dn = callputbs(sn, x, r, vldelta(v, -0.01, kv), t, cp)
        const dn = callputbs(sn, x, r, vldelta(v, -0.01, kv), t, cp);

        //     dp = callputbs(sp, x, r, vldelta(v, 0.01, kv), t, cp)
        const dp = callputbs(sp, x, r, vldelta(v, 0.01, kv), t, cp);

        //     deltabsvput2 = ((dp - dn) / s * 100 / 2) - 1
        result = ((dp - dn) / s * 100 / 2) - 1;
    }

    return result;
}

// DONE
// ' delta com volatilidade
function deltabsvput(s, x, r, v, t, cp, kv) {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        //     deltabsvput = 1
        result = 1;
    } else {    // Else
        //     sn = s / 1.01: sp = s * 1.01
        const sn = s / 1.01;
        const sp = s * 1.01;

        //     dn = putbs(sp, x, r, vldelta(v, -0.01, kv), t, cp)
        const dn = putbs(sp, x, r, vldelta(v, -0.01, kv), t, cp);

        //     dp = putbs(sn, x, r, vldelta(v, 0.01, kv), t, cp)
        const dp = putbs(sn, x, r, vldelta(v, 0.01, kv), t, cp);

        //     deltabsvput = ((dp - dn) / s * 100 / 2)
        result = ((dp - dn) / s * 100 / 2);
    }

    return result;
}

// DONE
// ' gama com volatilidade
function gamabsv(s, x, r, v, t, cp, kv) {
    var result = null;

    // sn = s / 1.01: sp = s * 1.01
    const sn = s / 1.01;
    const sp = s * 1.01;

    // dn = deltabsv(sn, x, r, v, t, cp, kv)
    const dn = deltabsv(sn, x, r, v, t, cp, kv);

    // dp = deltabsv(sp, x, r, v, t, cp, kv)
    const dp = deltabsv(sp, x, r, v, t, cp, kv);

    // gamabsv = (dp - dn) / s * 100 / 2
    result = (dp - dn) / s * 100 / 2;

    return result;
}

// DONE AND CORRECTED
// justoD, strike, selic, (difVCPVVD / 100), diasUteis, 1
function callputbs(s, x, r, v, t, cp) {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        //     callputbs = sfut(s, -t, r)
        result = sfut(s, -t, r);
    } else {    // Else
        //     If t <= 0 Then t = 0.0001 End If
        if (t <= 0) {
            t = 0.0001;
        }

        //     If v <= 0 Then v = 0.000001 End If
        if (v <= 0) {
            v = 0.000001;
        }

        // console.log('s: ' + s)
        // console.log('x: ' + x)
        // console.log('r: ' + r)
        // console.log('v: ' + v)
        // console.log('t: ' + t)

        //     If x > 0 Then
        if (x > 0) {
            // console.log(" ");
            // console.log("==============");
            // console.log(" ");

            //     d1 = cp * (Log(s / x) + (r + v ^ 2 / 2) * (t / 252)) / (v * Sqr(t / 252))
            const d1 = cp * (Math.log(s / x) + (r + v ** 2 / 2) * (t / 252)) / (v * Math.sqrt(t / 252));

            // console.log("1: " + Math.log(s / x));
            // console.log("2: " + (r + v ** 2 / 2));
            // console.log("3: " + (t / 252));
            // console.log("4: " + (v * Math.sqrt(t / 252)));
            // console.log(" ");

            //     d2 = d1 - v * Sqr(t / 252)
            const d2 = d1 - v * Math.sqrt(t / 252);

            //     callputbs = cp * s * distn(d1) - cp * x * distn(d2) * Exp(r * t / 252)  // using (r*t/252) instead of (-r*t/252)
            result = cp * s * distn(d1) - cp * x * distn(d2) * Math.exp(-r * t / 252);
            // console.log(" ");
            // console.log('d1: ' + d1)
            // console.log('distn(d1): ' + distn(d1))
            // console.log(" ");
            // console.log('d2: ' + d2)
            // console.log('distn(d2): ' + distn(d2))
            // console.log(" ");
            // console.log('result: ' + result)

            // throw new AppError(`s (justoD) = ${s} || x (strike) = ${x} || r (selic) = ${r} || v (difVCPVVD / 100) = ${v} || t (diasUteis) = ${t} || cp (1) = ${cp} || d1 = ${d1} || d2 = ${d2} || result = ${result}`)
        } else {    //     Else
            //     callputbs = 0
            result = 0;
        }
    }

    // console.log(" ");
    // console.log('////////////////////')
    // console.log(" ");

    return result;
}

// DONE
function putbs(s, x, r, v, t, cp): any {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        // putbs = sfut(s, -t, r)
        result = sfut(s, -t, r);
    } else {    // Else
        //     If t <= 0 Then
        if (t <= 0) {
            //     t = 0.0001
            t = 0.0001;
        }

        //     If v <= 0 Then
        if (v <= 0) {
            v = 0.000001;
        }

        //     If x > 0 Then
        if (x > 0) {
            //     d1 = cp * (Log(s / x) + (r + v ^ 2 / 2) * (t / 252)) / (v * Sqr(t / 252))
            const d1 = cp * (Math.log(s / x) + (r + v ** 2 / 2) * (t / 252)) / (v * Math.sqrt(t / 252));

            //     d2 = d1 - v * Sqr(t / 252)
            const d2 = d1 - v * Math.sqrt(t / 252);

            //     putbs = (cp * x * distn(-d2) * Exp(-r * t / 252) - cp * s * distn(-d1))
            result = (cp * x * distn(-d2) * Math.exp(-r * t / 252) - cp * s * distn(-d1));
        } else {    //     Else
            //     putbs = 0
            result = 0;
        }

    }

    return result;
}

// DONE
function putbs2(s, x, r, v, t, cp) {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        //     putbs2 = sfut(s, -t, r)
        result = sfut(s, -t, r);
    } else {    // Else
        //     If t <= 0 Then
        if (t <= 0) {
            //     t = 0.0001
            t = 0.0001;
        }

        //     If v <= 0 Then
        if (v <= 0) {
            v = 0.000001;
        }

        //     If x > 0 Then
        if (x > 0) {
            //     d1 = cp * ((Log(s / x)) + (r + v ^ 2 / 2) * (t / 252)) / (v * Sqr(t / 252))
            const d1 = cp * ((Math.log(s / x)) + (r + v ** 2 / 2) * (t / 252)) / (v * Math.sqrt(t / 252));

            //     d2 = d1 - v * Sqr(t / 252)
            const d2 = d1 - v * Math.sqrt(t / 252);

            //     putbs2 = (cp * s * distn(d1) - cp * x * distn(d2) * Exp(-r * t / 252)) - s + x / (1 + ((r / 252) * t))
            result = (cp * s * distn(d1) - cp * x * distn(d2) * Math.exp(-r * t / 252)) - s + x / (1 + ((r / 252) * t));
        } else {    //     Else
            //     putbs2 = 0
            result = 0;
        }
    }

    return result;
}

// DONE
function deltabs(s, x, r, v, t, cp) {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        //     deltabs = 1
        result = 1;
    } else {    // Else
        //     sn = s / 1.01: sp = s * 1.01
        const sn = s / 1.01;
        const sp = s * 1.01;

        //     dn = callputbs(sn, x, r, v, t, cp)
        const dn = callputbs(sn, x, r, v, t, cp);

        //     dp = callputbs(sp, x, r, v, t, cp)
        const dp = callputbs(sp, x, r, v, t, cp);

        //     deltabs = (dp - dn) / s / 2
        result = (dp - dn) / s / 2;
    }

    return result;
}

// DONE
function deltabsput2(s, x, r, v, t, cp) {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        //     deltabsput = 1
        result = 1;
    } else {    // Else
        //     sn = s / 1.01: sp = s * 1.01
        const sn = s / 1.01;
        const sp = s * 1.01;

        //     dn = callputbs(sn, x, r, v, t, cp)
        const dn = callputbs(sn, x, r, v, t, cp);

        //     dp = callputbs(sp, x, r, v, t, cp)
        const dp = callputbs(sp, x, r, v, t, cp);

        //     deltabsput = ((dp - dn) / s / 2) - 1
        result = ((dp - dn) / s / 2) - 1;
    }

    return result;
}

// DONE
function deltabsput(s, x, r, v, t, cp) {
    var result = null;

    // If cp = 0 Then
    if (cp == 0) {
        //     deltabsput = 1
        result = 1;
    } else {    // Else
        //     sn = s / 1.01: sp = s * 1.01
        const sn = s / 1.01;
        const sp = s * 1.01;

        //     dn = putbs(sn, x, r, v, t, cp)
        const dn = putbs(sn, x, r, v, t, cp);

        //     dp = putbs(sp, x, r, v, t, cp)
        const dp = putbs(sp, x, r, v, t, cp);

        //     deltabsput = ((dp - dn) / s / 2)
        result = ((dp - dn) / s / 2);
    }

    return result;
}

// DONE
function gamabs(s, x, r, v, t, cp) {
    var result = null;

    // sn = s / 1.01: sp = s * 1.01
    const sn = s / 1.01;
    const sp = s * 1.01;

    // dn = deltabs(sn, x, r, v, t, cp)
    const dn = deltabs(sn, x, r, v, t, cp);

    // dp = deltabs(sp, x, r, v, t, cp)
    const dp = deltabs(sp, x, r, v, t, cp);

    // gamabs = (dp - dn) / s * 100 / 2
    result = (dp - dn) / s * 100 / 2;

    return result;
}

// DONE
function gamabsput(s, x, r, v, t, cp) {
    var result = null;

    // sn = s / 1.01: sp = s * 1.01
    const sn = s / 1.01;
    const sp = s * 1.01;

    // dn = deltabsput(sn, x, r, v, t, cp)
    const dn = deltabsput(sn, x, r, v, t, cp);

    // dp = deltabsput(sp, x, r, v, t, cp)
    const dp = deltabsput(sp, x, r, v, t, cp);

    // gamabsput = (dp - dn) / s * 100 / 2
    result = (dp - dn) / s * 100 / 2;

    return result;
}

// DONE
function tetabs(s, x, r, v, t, cp) {
    var result = null;

    // If x = 0 Then
    if (x == 0) {
        //     tetabs = 0
        result = 0;
    } else {    // Else
        //     t1 = t - 1
        const t1 = t - 1;

        //     d0 = callputbs(s, x, r, v, t, cp)
        const d0 = callputbs(s, x, r, v, t, cp);

        //     d1 = callputbs(s, x, r, v, t1, cp)
        const d1 = callputbs(s, x, r, v, t1, cp);

        //     tetabs = (d1 - d0)
        result = (d1 - d0);
    }

    return result;
}

// DONE
function tetabsput(s, x, r, v, t, cp) {
    var result = null;

    // If x = 0 Then
    if (x == 0) {
        //     tetabsput = 0
        result = 0;
    } else {    // Else
        //     t1 = t - 1
        const t1 = t - 1;

        //     d0 = putbs(s, x, r, v, t, cp)
        const d0 = putbs(s, x, r, v, t, cp);

        //     d1 = putbs(s, x, r, v, t1, cp)
        const d1 = putbs(s, x, r, v, t1, cp);

        //     tetabsput = (d1 - d0)
        result = (d1 - d0);
    }

    return result;
}

// DONE
function vegabs(s, x, r, v, t, cp) {
    var result = null;

    // If x = 0 Then
    if (x == 0) {
        //     vegabs = 0
        result = 0;
    } else {    // Else
        //     v1 = v + 0.01 / 100
        const v1 = v + 0.01 / 100;

        //     d0 = callputbs(s, x, r, v, t, cp)
        const d0 = callputbs(s, x, r, v, t, cp);

        //     d1 = callputbs(s, x, r, v1, t, cp)
        const d1 = callputbs(s, x, r, v1, t, cp);

        //     vegabs = (d1 - d0)
        result = (d1 - d0);
    }

    return result;
}

// DONE
function vegabsput(s, x, r, v, t, cp) {
    var result = null;

    // If x = 0 Then
    if (x == 0) {
        //     vegabsput = 0
        result = 0;
    } else {    // Else
        //     v1 = v + 0.01 / 100
        const v1 = v + 0.01 / 100;

        //     d0 = putbs(s, x, r, v, t, cp)
        const d0 = putbs(s, x, r, v, t, cp);

        //     d1 = putbs(s, x, r, v1, t, cp)
        const d1 = putbs(s, x, r, v1, t, cp);

        //     vegabsput = (d1 - d0)
        result = (d1 - d0);
    }

    return result;
}

// DONE
function rhobs(s, x, r, v, t, cp) {
    var result = null;

    // If x = 0 Then
    if (x == 0) {
        //     rhobs = 0
        result = 0;
    } else {    // Else
        //     r1 = r + 0.1
        const r1 = r + 0.1;

        //     d0 = callputbs(s, x, r, v, t, cp)
        const d0 = callputbs(s, x, r, v, t, cp);

        //     d1 = callputbs(s, x, r1, v, t, cp)
        const d1 = callputbs(s, x, r1, v, t, cp);

        //     rhobs = d1 - d0
        result = d1 - d0;
    }

    return result;
}

// DONE
function rhobsput(s, x, r, v, t, cp) {
    var result = null;

    // If x = 0 Then
    if (x == 0) {
        //     rhobsput = 0
        result = 0;
    } else {    // Else
        //     r1 = r + 0.1
        const r1 = r + 0.1;

        //     d0 = putbs(s, x, r, v, t, cp)
        const d0 = putbs(s, x, r, v, t, cp);

        //     d1 = putbs(s, x, r1, v, t, cp)
        const d1 = putbs(s, x, r1, v, t, cp);

        //     rhobsput = d1 - d0
        result = d1 - d0;
    }

    return result;
}

// DONE
function vextr(ct, s, x, cp): any {
    var result = null;

    // If cp = 1 Then
    if (cp == 1) {
        //     If s < x Then
        if (s < x) {
            //     vextr = ct
            result = ct;
        } else {    //     Else
            //     vextr = ct - (s - x)
            result = ct - (s - x);
        }
    } else if (cp == -1) {  // ElseIf cp = -1 Then
        //     If s > x Then
        if (s > x) {
            //     vextr = ct
            result = ct;
        } else {    //     Else
            //     vextr = ct - (x - s)
            result = ct - (x - s);
        }
    } else if (cp == 0) { // ElseIf cp = 0 Then
        //     vextr = ct - s
        result = ct - s;
    }

    return result;
}

// DONE
function sfut(s, n, j) {
    // sfut = s * Exp(-n * j)
    var result = s * Math.exp(-n * j);

    return result;
}

export { vsmile, vsmileput, deltabsv, deltabsvput2, deltabsvput, gamabsv, callputbs, putbs, putbs2, deltabs, deltabsput2, deltabsput, gamabs, gamabsput, tetabs, tetabsput, vegabs, vegabsput, rhobs, rhobsput, vextr, sfut };
