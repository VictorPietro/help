/* ========== SHEET RELATED ========== */
function exdiario() {

    // calcoff
    // Sheets("RESUMO").Select

    // cp = Range("B5"): vd = Range("C5"): sd = vd - cp
    // ctant = Range("E5"): teoant = Range("F5"): cart = Range("G5"): teo = Range("H5")

    // Sheets("DIARIO").Select
    // LIN = Range("B2")
    // desc = Range("D2")

    // 'corrcalc = corret(cp + vd, desc)

    // k = LIN + 4
    // If LIN = 0 Then
    //     pcel "A2", "Linhas": pcel "C2", "Desc%"

    //     pcel "A3", "Data"

    // End If
    // pcel "B2", LIN + 1
    // pcel "B1", k + 1
    // pcel "A" & k, Date$
    // pcel "D" & k, cp: pcel "E" & k, vd
    // pcel "F" & k, ctant: pcel "G" & k, teoant
    // pcel "H" & k, cart: pcel "I" & k, teo
    // calcon

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function elimdiario() {
    // If MsgBox("Eliminar Linha", vbOKCancel) = vbOK Then
    //     LIN = Range("B2")
    //     k = LIN + 3
    //     limpacel "A" & k
    //     limpacel lc("D", k, "E", k)
    //     limpacel lc("H", k, "I", k)
    //     pcel "B2", LIN - 1
    //     pcel "B1", k - 1
    //     origem0
    // End If

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function calcdiario() {
    // calcoff
    //     LIN = Range("B2")
    //     k = LIN + 3
    //     origem0
    // calcon

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function transres() {
    // pcp = Range("B8"): pvd = Range("C8")
    // vcp = Range("B9"): vvd = Range("C9")
    // Sheets("PETR4").Select
    // pcel "D7", pcp
    // pcel "E7", pvd

    // Sheets("VALE5").Select
    // pcel "D7", vcp
    // pcel "E7", vvd

    // Sheets("RESUMO").Select
    // Range("E10").Select

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function transop() {
    // Sheets("PETR4").Select
    // limpacel "H240:I289"

    // Sheets("VALE5").Select
    // limpacel "H240:I289"

    // Sheets("RESUMO").Select
    // i = 11
    // c1 = "x"
    // While c1 <> ""
    //     c1 = Range("A" & i)
    //     If c1 <> "" Then
    //     i = i + 1
    //     End If
    // Wend
    // colorn lc("A", 11, "B", i - 1), 11, 8

    // Range(lc("A", 11, "B", i - 1)).Select
    // Selection.Copy
    // Sheets("PETR4").Select
    // Range("H240").Select
    // Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
    //     :=False, Transpose:=False

    // exresumo

    // Sheets("RESUMO").Select

    // k = i + 2
    // i = k
    // c1 = "x"
    // While c1 <> ""
    //     c1 = Range("A" & i)
    //     If c1 <> "" Then
    //     i = i + 1
    //     End If
    // Wend

    // Range(lc("A", k, "B", i - 1)).Select
    // Selection.Copy
    // Sheets("VALE5").Select
    // Range("H240").Select
    // Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
    //     :=False, Transpose:=False

    // exresumo

    // Sheets("RESUMO").Select

    // colorn lc("A", k, "B", i - 1), 10, 8

    var result = null;

    return result;
}

/* ========== SHEET RELATED ========== */
function financeiro() {
    // calcoff
    // k = Range("B2") + 3
    // j = k + 1
    // calcon

    var result = null;

    return result;
}

export { exdiario, elimdiario, calcdiario, transres, transop, financeiro };
