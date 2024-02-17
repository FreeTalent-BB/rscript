/**
    Name: BORDER
    Description:  Define the color of the border of screen
    Syntax: BORDER color
    Parameters: 
        - color: An integer value between 0 and 15
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
                console.log( 'Argument missing in "' + src + '" at line ' + ln + ': BORDER takes 1 integer Background.' );
                process.exit( 1 );
            }

            var args = parts[ 1 ];
            if( args )
            {

                if( !isNaN( args.trim() ) )
                {
                    var n = parseInt( args.trim() );
                    if( config.display && config.display.colors )
                    {
                        if( n < 0 || n > config.display.colors-1 )
                        {
                            console.log( 'Improper argument in "' + src + '" at line ' + ln + ': BORDER Background value must be between 0 and ' + ( config.display.colors - 1 ) + '.' );
                            process.exit( 1 );                            
                        }
                    }
                } 

                code = '!border_color=' + args.trim() + ':gosub @set_border';
            }
        }
        return code;
    }
}
module.exports = TOKEN;
