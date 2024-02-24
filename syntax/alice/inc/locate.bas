#label locate
    IF !line>0 THEN !line=!line+7
    POKE &r6,!line:POKE &r7,!col:RETURN
