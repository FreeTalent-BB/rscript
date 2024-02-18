#label locate
    IF !line>0 THEN !line=!line+7
    POKE &r6,!col:POKE &r7,!line:RETURN
