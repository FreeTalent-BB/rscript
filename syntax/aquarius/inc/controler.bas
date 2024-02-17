;
; Controler Routine for Mattel AQUARIUS
;
#var JOYTEST
#var RX
#var RI
#var JOY_INIT

#const JNONE=255
#const JUP=251
#const JDOWN=254
#const JLEFT=247
#const JRIGHT=253
#const FIRE1=191
#const FIRE2=123

#label joy_asm_data
    DATA 62,7,211,247,62,63,211,246,62,14,211,247,219,246,50,216,57,201
#label init_joy
    !RI=14790:POKE14340,198:POKE14341,57
    restore @joy_asm_data

#label read_joy_asm
    READ!RX:POKE!RI,!RX:!RI=!RI+1:IF!RX<>201THEN@read_joy_asm
Return

#label get_joy
    !RX=USR(0):!JOYTEST=PEEK(!RI)
Return