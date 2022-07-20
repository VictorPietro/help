/* ========== SHEET RELATED ========== */
function protect() {
    // ActiveSheet.protect DrawingObjects:=True, Contents:=True, Scenarios:=True
    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function unprotect() {
    // unprotect Password:=392640
    // ActiveSheet.unprotect
    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function calcoff() {
    // With Application
    //     .Calculation = xlManual
    //     .MaxChange = 0.001
    // End With
    // ActiveWorkbook.PrecisionAsDisplayed = False

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function calcon() {
    // With Application
    //     .Calculation = xlAutomatic
    //     .MaxChange = 0.001
    // End With
    // ActiveWorkbook.PrecisionAsDisplayed = False

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function limpacel() {
    // Range(cel).Select
    // Selection.ClearContents

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function pcel() {
    // prints in cell

    // Range(cel).FormulaR1C1 = valor
    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function copiavalor() {
    // Range(cel1).Select
    // Selection.Copy
    // Range(cel2).Select
    // Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
    //     :=False, Transpose:=False

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function copiaformula() {
    // Range(cel1).Select
    // Selection.Copy
    // Range(cel2).Select
    // Selection.PasteSpecial Paste:=xlPasteFormulas, Operation:=xlNone, _
    //         SkipBlanks:=False, Transpose:=False

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function lc(c1, l1, c2, l2) {
    // ; linha coluna celula

    // lc = c1 + Trim(Str(l1))
    // If c2 <> "" Then
    //     lc = lc + ":" + c2 + Trim(Str(l2))
    // End If

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function sc(c) {
    // sum column

    // c = UCase(c)
    // If Len(c) = 1 Then
    //     c1 = 0
    //     c2 = Asc(c)
    // Else
    //     c1 = Asc(Left(c, 1))
    //     c2 = Asc(Right(c, 1))
    // End If
    // If c2 > 89 Then
    //     c2 = 65
    //     If c1 = 0 Then c1 = 65 Else c1 = c1 + 1
    // Else
    //     c2 = c2 + 1
    // End If
    // If c1 = 0 Then c1 = "" Else c1 = Chr(c1)
    // sc = c1 + Chr(c2)

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function fnum(cel, n) {
    // formato num 0 - comum / 1 - vermelho

    // If n = 0 Then
    //     Range(cel).Select
    //     Selection.NumberFormat = "0.0"
    // Else
    //     Range(cel).Select
    //     Selection.NumberFormat = "0.0;[Red]0.0"
    // End If

    var result = null;

    return result;
}

export { protect, unprotect, calcoff, calcon, limpacel, pcel, copiavalor, copiaformula, lc, sc, fnum };
