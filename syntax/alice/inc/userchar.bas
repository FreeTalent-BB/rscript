#label userchar
;
; TODO! Compute the values of TAMP and NCHAR from the value of !c
;
    !tamp = INT(!c/4)0 : !nchar = !c-!tamp*4
    POKE &r1,!tamp*4*!nchar:POKE &r2,129:POKE &re,0:GOSUB @busy:RETURN
