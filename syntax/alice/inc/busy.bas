#label busy
    IF PEEK(&r0)<=0 THEN GOSUB @busy ELSE RETURN
