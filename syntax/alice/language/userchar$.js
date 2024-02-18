/**
    Name: USERCHAR$
    Description: Draw an user character on the screen from the current text cursor position
    Syntax: USERCHAR$ buffer, nchar
    Parameters: 
        - buffer: Must be an integer (buffer number (0 - 24))
        - nchar: Must be an integer (value of the user character (0 - 3))
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
                console.log( 'Argument missing in "' + src + '" at line ' + ln + ': USERCHAR$ takes 2 integer values.' );
                process.exit( 1 );
            }

            var args = parts[ 1 ].trim().split( ',' );
            console.log( args );
            if( args )
            {
                if( args.length != 2 )
                {
                    console.log( 'Argument missing in "' + src + '" at line ' + ln + ': USERCHAR$ takes 2 integers BUFFER and NCHAR.' );
                    process.exit( 1 );                    
                }

                if( !isNaN( args[ 0 ].trim() ) )
                {
                    var n = parseInt( args[ 0 ].trim() );
                    if( n < 0 || n > 24 )
                    {
                        console.log( 'Improper argument in "' + src + '" at line ' + ln + ': USERCHAR$ BUFFER value must be between 0 and 24.' );
                        process.exit( 1 );                            
                    }
                } 

                if( !isNaN( args[ 1 ].trim() ) )
                {
                    var n = parseInt( args[ 1 ].trim() );
                    if( config.display && config.display.rows )
                    {
                        if( n < 0 || n > config.display.rows-1 )
                        {
                            console.log( 'Improper argument in "' + src + '" at line ' + ln + ': USERCHAR$ NCHAR value must be between 0 and 3.' );
                            process.exit( 1 );                            
                        }
                    }
                } 
                code = '!tamp=' + args[ 0 ].trim() + ':!nchar=' + args[ 1 ].trim() + ':GOSUB @userchar';
            }
        }
        return code;
    }
}
module.exports = TOKEN;
