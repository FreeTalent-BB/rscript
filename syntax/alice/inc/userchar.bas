#label userchar
;
; TODO! Compute the values of TAMP and NCHAR from the value of !c
;
    POKE &r1,!c:POKE &r2,129:POKE &re,0:GOSUB @busy:RETURN
