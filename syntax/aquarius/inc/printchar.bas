;
; Display a character on screen at the text position X/Y 
; with the forground color and background color wanted.
;
#var char_x
#var char_y
#var char_v
#var text$
#var fg_color
#var bg_color

#const black=0
#const dark_grey=1
#const red=2
#const dark_red=3
#const dark_yellow=4
#const yellow=5
#const green=6
#const dark_green=7
#const dark_cyan=8
#const cyan=9
#const blue=10
#const dark_purple=11
#const fushia=12
#const dark_fushia=13
#const grey=14
#const white=15

#label show_char
    POKE 12328+(!char_y*40)+!char_x,!char_v
    POKE 12328+1024+(!char_y*40)+!char_x,(!fg_color*16)+!bg_color
Return

#label show_text
    FOR !for_var1=1 TO LEN(!text$)
        !char_v=ASC(MID$(!text$,!for_var1,1))
        POKE 12328+(40*!char_y)+!char_x+(!for_var1-1),!char_v
        POKE 13352+(40*!char_y)+!char_x+(!for_var1-1),!fg_color*16+!bg_color
    NEXT !for_var1    
Return