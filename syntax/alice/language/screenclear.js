/**
    Name: SCREENCLEAR
    Description:  Clear the background of screen
    Syntax: SCREENCLEAR
*/
var TOKEN = 
{
    transpile: function( src, ln, config, cmd, options )
    {
        var code = '';
        code = 'GOSUB @_screenclean';
        return code;
    }
}
module.exports = TOKEN;
