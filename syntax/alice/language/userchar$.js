/**
    Name: USERCHAR$
    Description: Draw an user character on the screen from the current text cursor position
    Syntax: USERCHAR$ value
    Parameters: 
        - value: Must be a integer (value of the user character (1 - 100))
*/
var TOKEN = 
{
    transpile: function( src, ln, config, cmd, options )
    {
        var code = '';
        var parts = cmd.trim().split( " " );
        if( parts )
        {
            if( parts.length < 2 )
            {
                console.log( 'Argument missing in "' + src + '" at line ' + ln + ': TEXT$ takes 1 string value.' );
                process.exit( 1 );
            }

            var args = '';
            for( var p = 1; p < parts.length;p++ )
            {
                if( args != '')
                {
                    args = args + ' ';
                }
                args = args + parts[ p ];
            }
            if( args )
            {
                code = '!c=' + args.trim() + ':GOSUB @userchar';
            }
        }
        return code;
    }
}
module.exports = TOKEN;
