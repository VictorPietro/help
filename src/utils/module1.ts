import { AppError } from "@shared/errors/AppError";
import NormalDistribution from "normal-distribution";

/*  POZ  --  probability of normal z value

    Adapted from a polynomial approximation in:
            Ibbetson D, Algorithm 209
            Collected Algorithms of the CACM 1963 p. 616
    Note:
            This routine has six digit accuracy, so it is only useful for absolute
            z values <= 8.  For z values > to 6.0, poz() returns 0.0.
*/
function poz(z) {
    var y, x, w;

    if (z == 0.0) {
        x = 0.0;
    } else {
        y = 0.5 * Math.abs(z);
        if (y > (8 * 0.5)) {
            x = 1.0;
        } else if (y < 1.0) {
            w = y * y;
            x = ((((((((0.000124818987 * w
                - 0.001075204047) * w + 0.005198775019) * w
                - 0.019198292004) * w + 0.059054035642) * w
                - 0.151968751364) * w + 0.319152932694) * w
                - 0.531923007300) * w + 0.797884560593) * y * 2.0;
        } else {
            y -= 2.0;
            x = (((((((((((((-0.000045255659 * y
                + 0.000152529290) * y - 0.000019538132) * y
                - 0.000676904986) * y + 0.001390604284) * y
                - 0.000794620820) * y - 0.002034254874) * y
                + 0.006549791214) * y - 0.010557625006) * y
                + 0.011630447319) * y - 0.009279453341) * y
                + 0.005353579108) * y - 0.002141268741) * y
                + 0.000535310849) * y + 0.999936657524;
        }
    }
    // console.log("w: " + w);
    // console.log("x: " + x);
    // console.log("y: " + y);
    // console.log("z: " + z);
    return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
}

// DONE
function distn(xp: number) {
    // // If xp >= 0 Then x = xp Else x = -xp
    // const x = (xp >= 0) ? xp : (xp * -1);

    // // nl = 1 / Sqr(2 * 3.141592) * Exp(-x ^ 2 / 2)
    // const nl = 1 / Math.sqrt(2 * 3.141592) * Math.exp(((x * -1) ** 2) / 2);

    // // k = 1 / (1 + 0.33267 * x)
    // const k = 1 / (1 + 0.33267 * x);

    // // d = 1 - (0.4361836 * k - 0.1201676 * k ^ 2 + 0.937298 * k ^ 3) * nl
    // const d = 1 - (0.4361836 * k - 0.1201676 * k ** 2 + 0.937298 * k ** 3) * nl;

    // // throw new AppError(`x = ${x} || nl = ${nl} || k = ${k} || d = ${d}`);

    // // If xp >= 0 Then distn = d Else distn = 1 - d
    // if (xp >= 0) {
    //     return d;
    // } else {
    //     return (1 - d);
    // }
    const normDist = new NormalDistribution(0, 1);

    return poz(xp);
}

// DONE
function pbrisc(x: number) {
    var result = null;

    // If x > 0 Then pbrisc = (1 - distn(x)) * 100 Else pbrisc = distn(x) * 100 End If
    if (x > 0) {
        result = (1 - distn(x)) * 100;
    } else {
        result = distn(x) * 100;
    }

    return result;
}

// DONE
function secante(x1: number, y1: number, x2: number, y2: number) {
    var result = null;

    // If Abs(y2 - y1) > 0.001 Then secante = x1 - y1 * (x2 - x1) / (y2 - y1) Else secante = x2 End If
    if (Math.abs(y2 - y1) > 0.001) {
        result = x1 - y1 * (x2 - x1) / (y2 - y1);
    } else {
        result = x2;
    }

    return result;
}

export { distn, pbrisc, secante };
