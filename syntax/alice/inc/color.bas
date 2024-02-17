#label color
    !b=177:!a=1
    IF !crayon > 7 THEN !b=!b+1:!crayon=!crayon-8
    IF !papier > 7 THEN !b=!b+1:!papier=!papier-8
    !a=!papier+(!crayon*16)
    POKE &r2,!b:POKE &r3,!a:RETURN
