/**
    Name: IMAGE
    Description: Draw an image stored in the datas
    Syntax: IMAGE datas_line_number
    Parameters: 
        - datas_line_number: Must be an line number when strats the image datas
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
                console.log( 'Argument missing in "' + src + '" at line ' + ln + ': IMAGE$ takes 1 integer value.' );
                process.exit( 1 );
            }

            var args = parts[ 1 ];
            if( args )
            {
                code = 'restore' + args.trim() + ':gosub @show_image';
            }
        }
        return code;
    }
}
module.exports = TOKEN;
