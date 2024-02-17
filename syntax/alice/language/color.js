/**
    Name: COLOR
    Description:  Define the foreground and background colors for the next text
    Syntax: COLOR pen,paper
    Parameters: 
        - pen: An integer value between 0 and 15
        - paper: An integer value between 0 and 15
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
                console.log( 'Argument missing in "' + src + '" at line ' + ln + ': COLOR takes 2 integers Foreground and Background.' );
                process.exit( 1 );
            }

            var args = parts[ 1 ].trim().split( ',' );
            if( args )
            {
                if( args.length != 2 )
                {
                    console.log( 'Argument missing in "' + src + '" at line ' + ln + ': COLOR takes 2 integers Foreground and Background.' );
                    process.exit( 1 );                    
                }

                if( !isNaN( args[ 0 ].trim() ) )
                {
                    var n = parseInt( args[ 0 ].trim() );
                    if( config.display && config.display.colors )
                    {
                        if( n < 0 || n > config.display.colors-1 )
                        {
                            console.log( 'Improper argument in "' + src + '" at line ' + ln + ': COLOR Foreground value must be between 0 and ' + ( config.display.colors - 1 ) + '.' );
                            process.exit( 1 );                            
                        }
                    }
                } 

                if( !isNaN( args[ 1 ].trim() ) )
                {
                    var n = parseInt( args[ 1 ].trim() );
                    if( config.display && config.display.colors )
                    {
                        if( n < 0 || n > config.display.colors-1 )
                        {
                            console.log( 'Improper argument in "' + src + '" at line ' + ln + ': COLOR Background value must be between 0 and ' + ( config.display.colors - 1 ) + '.' );
                            process.exit( 1 );                            
                        }
                    }
                } 

                code = '!crayon=' + args[ 0 ].trim() + ':!papier=' + args[ 1 ].trim() + ':GOSUB @color';
            }
        }
        return code;
    }
}
module.exports = TOKEN;
