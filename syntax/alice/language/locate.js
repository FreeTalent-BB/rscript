/**
    Name: LOCATE
    Description:  Define the position of the text cursor on screen
    Syntax: LOCATE column,row
    Parameters: 
        - column: An integer value between 0 and 39
        - row: An integer value between 0 and 23
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
                console.log( 'Argument missing in "' + src + '" at line ' + ln + ': LOCATE takes 2 integers X and Y.' );
                process.exit( 1 );
            }

            var args = parts[ 1 ].trim().split( ',' );
            if( args )
            {
                if( args.length != 2 )
                {
                    console.log( 'Argument missing in "' + src + '" at line ' + ln + ': LOCATE takes 2 integers X and Y.' );
                    process.exit( 1 );                    
                }

                if( !isNaN( args[ 0 ].trim() ) )
                {
                    var n = parseInt( args[ 0 ].trim() );
                    if( config.display && config.display.cols )
                    {
                        if( n < 0 || n > config.display.cols-1 )
                        {
                            console.log( 'Improper argument in "' + src + '" at line ' + ln + ': LOCATE X value must be between 0 and ' + ( config.display.cols - 1) + '.' );
                            process.exit( 1 );                            
                        }
                    }
                } 

                if( !isNaN( args[ 1 ].trim() ) )
                {
                    var n = parseInt( args[ 1 ].trim() );
                    if( config.display && config.display.rows )
                    {
                        if( n < 0 || n > config.display.rows-1 )
                        {
                            console.log( 'Improper argument in "' + src + '" at line ' + ln + ': LOCATE Y value must be between 0 and ' + ( config.display.rows - 1 ) + '.' );
                            process.exit( 1 );                            
                        }
                    }
                } 

                code = '!line=' + args[ 0 ].trim() + ':!col=' + args[ 1 ].trim() + ':GOSUB @locate';
            }
        }
        return code;
    }
}
module.exports = TOKEN;
