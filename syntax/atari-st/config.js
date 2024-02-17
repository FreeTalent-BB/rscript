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
    path: 'atari-st',
    name: 'Atari ST - STE - STF',
    version: '1.0',
    author: 'Baptiste Bideaux',

    // Hardware 
    ram: [ 512, 1024, 2048, 4096 ],
    display:
    {
        colors: 16,
        width: 320,
        height: 200,
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
    [],

    // Compress method
    compress: function( line )
    {
        return line;
    },

    // Execute before transpilation
    executeBefore: '',
    
    // Execute after transpilation
    executeAfter: ''
}
module.exports = Config;
