#label defchar
    RESTORE:!tamp=8:!nchar=0
    FOR !for_var1=0 TO !limit_char-1
        IF !nchar>3 THEN GOSUB @inc_tamp
        !a=(192+!nchar)-4
        FOR !for_var2=1 TO 10:READ !b:!a=!a+4:POKE &r1,!b:POKE &r4,!tamp:POKE &r5,!a:POKE &re,52:GOSUB @busy:NEXT !for_var2
        !nchar=!nchar+1
    NEXT !for_var1
    RETURN

#label inc_tamp
    !tamp=!tamp+1:!nchar=0
    ;IF !tamp>0 THEN !tamp=!tamp+7
    RETURN
