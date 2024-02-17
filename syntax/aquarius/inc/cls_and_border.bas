;
; Fast fill routine and border color
;
#var fill_var1
#var fill_var2
#var fill_var3
#var cls_color
#var border_color

#label cls
;   ?CHR$(11):FOR !fill_var1=12328 to 13287:POKE !fill_var1,32:POKE !fill_var1+1024,!cls_color:NEXT !fill_var1
    ?CHR$(11):POKE 12369, 32:!fill_var1=!cls_color:!fill_var2=USR(!fill_var1)
Return

#label init_fill_asm
    restore @fill_asm_datas
    !fill_var3 = PEEK(14553) * 256 + PEEK(14552) + 7
    FOR !fill_var1 = 0 to 15
        READ !fill_var2:POKE !fill_var3 + !fill_var1, !fill_var2
    NEXT
    POKE 14341, !fill_var3/256
    POKE 14340, !fill_var3 AND 255
Return

#label fill_asm_datas
    DATA 205,130,6
    DATA 1,255,3,33,0,52,115,17,1,52,237,176,201

#label set_border
    FOR !fill_var1 = 12288 TO 12327 : POKE !fill_var1, 32 : POKE !fill_var1 + 1024, !border_color : NEXT !fill_var1    
Return