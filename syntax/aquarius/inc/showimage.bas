#var image_datas_size
#var for_image1
#var for_image2
#var num_data
#var color_data

#label show_image
    READ !image_datas_size
    FOR !for_image1 = 1 TO !image_datas_size
        READ !char_x, !fg_color, !char_v
        IF !char_v = 32 THEN @l_150
        POKE 12328 + !char_x, !char_v
#label l_150
        POKE 13352 + !char_x, !fg_color
    NEXT !for_image1
Return 