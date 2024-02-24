String.prototype.strReplace = function( strSearch, strReplace )
{
	var newStr = '';
	for( n = 0; n < this.length; n++ )
	{
		var part = this.substr( n, strSearch.length );
		if( part == strSearch )
		{
			newStr = newStr + strReplace;
			n = n + ( strSearch.length - 1 );
		}
		else
		{
			newStr = newStr + part.substr( 0, 1 );
		}
	}
	return newStr;
};

var Config = 
{
    // Infos
    path: 'alice',
    name: 'Matra Alice 32/90',
    version: '1.0',
    author: 'Baptiste Bideaux',

    // Hardware 
    ram: [ 4, 16, 32 ],
    display:
    {
        colors: 8,
        width: 320,
        height: 250,
        rows: 25,
        cols: 40
    },

    codeLine:
    {
        lineNumber: true, // Add line number
        numChar: 255 // Number of characters by line
    },

    // auto-includes
    includes: 
    [
        'vars.bas',
        'screenclear.bas',
        'defchar.bas',
        'busy.bas',
        'locate.bas',
        'color.bas',
        'userchar.bas',
    ],

    // Compress method
    compress: function( line )
    {
        var newLine = '';
        var numLine = line.substring( 0, line.indexOf( " ") ).trim();
        line = line.substring( line.indexOf( ' ' ), line.length ).trim(); 
        //line = line.strReplace( ' ','' );
        line = line.strReplace( '\\s',' ' );
        return numLine + ' ' + line;
    },

    // Execute before transpilation
    executeBefore: '',
    
    // Execute after transpilation
    executeAfter: ''
}
module.exports = Config;
