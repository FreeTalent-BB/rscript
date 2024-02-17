/**
    Name: CHAR$
    Description: Draw a character on the screen from the current text cursor position
    Syntax: CHAR$ ascii-value
    Parameters: 
        - ascii-value: Must be an integer between 48 and 160
*/
var TOKEN = 
{
    transpile: function( src, ln, config, cmd, options )
    {
        var code = '';
        var parts = cmd.trim().split( " " );
        if( parts )
        {
            if( parts.length != 2 )
            {
                console.log( 'Argument missing in "' + src + '" at line ' + ln + ': CHAR$ takes 1 integer value.' );
                process.exit( 1 );
            }

            var args = parts[ 1 ];
            if( args )
            {
                code = '!char_v=' + args.trim() + ':gosub @show_char';
            }
        }
        return code;
    }
}
module.exports = TOKEN;
