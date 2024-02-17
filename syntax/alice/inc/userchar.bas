#label userchar
;
; TODO! Compute the values of TAMP and NCHAR from the value of !c
;
    !tamp = 0 : !nchar = 0
    IF !tamp>0 THEN !tamp=!tamp+7
    POKE &r1,!tamp*4*!nchar:POKE &r2,129:POKE &re,0:GOSUB @busy:RETURN
