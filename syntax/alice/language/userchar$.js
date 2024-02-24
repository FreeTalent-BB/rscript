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
        /**
        if( parts.length < 2 )
        {
            console.log( 'Argument missing in "' + src + '" at line ' + ln + ': USERCHAR$ takes 1 string value.' );
            process.exit( 1 );
        }
        */
        if( parts )
        {
            var args = parts[ 1 ].trim().split( ',' );
            if( args )
            {
                if( args.length != 2 )
                {
                    console.log( 'Argument missing in "' + src + '" at line ' + ln + ': USERCHAR$ takes 2 integers BUFFER and CHAR.' );
                    process.exit( 1 );                    
                }

                if( !isNaN( args[ 0 ].trim() ) )
                {
                    var n = parseInt( args[ 0 ].trim() );
                    if( n < 0 || n > 31 )
                    {
                        console.log( 'Improper argument in "' + src + '" at line ' + ln + ': USERCHAR$ BUFFER value must be between 0 and 24.' );
                        process.exit( 1 );                            
                    }
                } 

                if( !isNaN( args[ 1 ].trim() ) )
                {
                    var n = parseInt( args[ 1 ].trim() );
                    if( n < 0 || n > 3 )
                    {
                        console.log( 'Improper argument in "' + src + '" at line ' + ln + ': USERCHAR$ CHAR value must be between 0 and 3.' );
                        process.exit( 1 );                            
                    }
                } 
            }
            
            code = '!c=' + args[ 0 ].trim() + '*4+' + args[ 1 ].trim() + ':GOSUB @userchar';
        }           
/**            
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
*/
        return code;
    }
}
module.exports = TOKEN;
