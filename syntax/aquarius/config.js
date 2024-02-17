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
    path: 'aquarius',
    name: 'Mattel Aquarius Basic S1/S2',
    version: '1.0',
    author: 'Baptiste Bideaux',

    // Hardware 
    ram: [ 4, 16, 32 ],
    display:
    {
        colors: 16,
        width: 320,
        height: 192,
        rows: 24,
        cols: 40
    },

    codeLine:
    {
        lineNumber: true, // Add line number
        numChar: 72 // Number of characters by line
    },

    // auto-includes
    includes: 
    [
    //    'controler.bas',
        'vars.bas',
        'cls_and_border.bas',
        'printchar.bas',
        'showimage.bas'
    ],

    // Compress method
    compress: function( line )
    {
        var newLine = '';
        var numLine = line.substring( 0, line.indexOf( " ") ).trim();
        line = line.substring( line.indexOf( ' ' ), line.length ).trim(); 
        line = line.strReplace( 'print', '?' );
        line = line.strReplace( 'PRINT', '?' );
        line = line.strReplace( 'Print', '?' );
        line = line.strReplace( 'then goto', 'then' );
        line = line.strReplace( 'then GOTO', 'then' );
        line = line.strReplace( 'THEN goto', 'then' );
        line = line.strReplace( 'THEN GOTO', 'then' );
        line = line.strReplace( 'Then goto', 'then' );
        line = line.strReplace( 'Then Goto', 'then' );
        line = line.strReplace( 'then Goto', 'then' );
        line = line.strReplace( 'THEN Goto', 'then' );
        line = line.strReplace( ' ','' );
        line = line.strReplace( '\\s',' ' );
        return numLine + ' ' + line;
    },

    // Execute before transpilation
    executeBefore: '',
    
    // Execute after transpilation
    executeAfter: ''
}
module.exports = Config;
