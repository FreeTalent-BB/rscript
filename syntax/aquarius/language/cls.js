/**
    Name: CLS
    Description: Fille the screen background with a color
    Syntax: CLS color
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
                console.log( 'Argument missing in "' + src + '" at line ' + ln + ': CLS takes 1 integer Background.' );
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
                            console.log( 'Improper argument in "' + src + '" at line ' + ln + ': CLS Background value must be between 0 and ' + ( config.display.colors - 1 ) + '.' );
                            process.exit( 1 );                            
                        }
                    }
                } 

                code = '!cls_color=' + args.trim() + ':gosub @cls';
            }
        }
        return code;
    }
}
module.exports = TOKEN;
