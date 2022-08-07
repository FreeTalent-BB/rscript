const PATH = require( 'path' );
const FS = require( 'fs' );

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
}

var w = -1;
var compression = "none";
var formatData = "dec";
var rscriptLabels = "no";
var tmxFile = "";
var outputPath = ".";
var maxData = 8;

function plugin( options )
{
	tmxFile = options.source;
	if( tmxFile == undefined )
	{
		return false;
	}
	
	compression = (options.c)?options.c:"none";
	formatData = (options.f)?options.f:"dec";
	outputPath = (options.o)?options.o:"./output.bas";
	rscriptLabels = (options.rl)?options.rl:"no";
	maxData = (options.max)?(options.max):8;
	return convertTMX();
}

exports.plugin = tmx2bas;

function showHelp()
{
    console.log( 'Syntax in command line:' );
    console.log( 'tmx2bas.js <tmxfile> [-h] [-c=<none|rle>] [-o=<output path>] [-rl=<no|yes>] [-max=<number>] [-f=<dec|hex|str>]' );
    console.log( ' tmxfile: Absolute path of the TMX file.' );
    console.log( '-h: This help.' );
    console.log( '-c: Compression type. Must be "none", "rle" ("none" by default).' );
	console.log( '    "rle": See https://en.wikipedia.org/wiki/Run-length_encoding' );
	console.log( '    Note: If the STR format type is used, RLE will be packed to 110 interations maximum, else 255.' );
    console.log( '-o: Destination path. Current path by default.' );
    console.log( '-rl: Adding the RSCRIPT labels. Must be "no" or "yes". "no" by default.' );
    console.log( '-max: Maximum data by line. 8 by default.' );
	console.log( '-f: Format type. Must be "dec", "hex" or "str". ("dec" by default)' );
	console.log( '    "dec": Datas will be stored like DATA 1,2,3,4,...' );
	console.log( '    "hex": Datas will be stored like DATA AA,BB,CC, DD,...' );
	console.log( '    "str": Datas will be stored like DATA "0123456ABCD...". ');
	console.log( '    This format converts the indexes of each tile by an character. Note: It is limited to 110 indexes." ');
	console.log( '');
	console.log( '    |   Tile index   |   character   |" ');
	console.log( '    ----------------------------------" ');
	console.log( '    |        0       |       "0"     |" ');
	console.log( '    |        1       |       "1"     |" ');
	console.log( '    |        2       |       "2"     |" ');
	console.log( '    |        3       |       "3"     |" ');
	console.log( '    |        4       |       "4"     |" ');
	console.log( '    |        5       |       "5"     |" ');
	console.log( '    |        6       |       "6"     |" ');
	console.log( '    |        7       |       "7"     |" ');
	console.log( '    |        8       |       "8"     |" ');
	console.log( '    |        9       |       "9"     |" ');
	console.log( '    |       10       |       "a"     |" ');
	console.log( '    |       11       |       "b"     |" ');
	console.log( '    |       12       |       "c"     |" ');
	console.log( '    |       13       |       "d"     |" ');
	console.log( '    |       14       |       "e"     |" ');
	console.log( '    |       15       |       "f"     |" ');
	console.log( '    |       16       |       "g"     |" ');
	console.log( '    |       17       |       "h"     |" ');
	console.log( '    |       18       |       "i"     |" ');
	console.log( '    |       19       |       "j"     |" ');
	console.log( '    |       20       |       "k"     |" ');
	console.log( '    |       21       |       "l"     |" ');
	console.log( '    |       22       |       "m"     |" ');
	console.log( '    |       23       |       "n"     |" ');
	console.log( '    |       24       |       "o"     |" ');
	console.log( '    |       25       |       "p"     |" ');
	console.log( '    |       26       |       "q"     |" ');
	console.log( '    |       27       |       "r"     |" ');
	console.log( '    |       28       |       "s"     |" ');
	console.log( '    |       29       |       "t"     |" ');
	console.log( '    |       30       |       "u"     |" ');
	console.log( '    |       31       |       "v"     |" ');
	console.log( '    |       32       |       "w"     |" ');
	console.log( '    |       33       |       "x"     |" ');
	console.log( '    |       34       |       "y"     |" ');
	console.log( '    |       35       |       "z"     |" ');
	console.log( '    |       36       |       "A"     |" ');
	console.log( '    |       37       |       "B"     |" ');
	console.log( '    |       38       |       "C"     |" ');
	console.log( '    |       39       |       "D"     |" ');
	console.log( '    |       40       |       "E"     |" ');
	console.log( '    |       41       |       "F"     |" ');
	console.log( '    |       42       |       "G"     |" ');
	console.log( '    |       43       |       "H"     |" ');
	console.log( '    |       44       |       "I"     |" ');
	console.log( '    |       45       |       "J"     |" ');
	console.log( '    |       46       |       "K"     |" ');
	console.log( '    |       47       |       "L"     |" ');
	console.log( '    |       48       |       "M"     |" ');
	console.log( '    |       49       |       "N"     |" ');
	console.log( '    |       50       |       "O"     |" ');
	console.log( '    |       51       |       "P"     |" ');
	console.log( '    |       52       |       "Q"     |" ');
	console.log( '    |       53       |       "R"     |" ');
	console.log( '    |       54       |       "S"     |" ');
	console.log( '    |       55       |       "T"     |" ');
	console.log( '    |       56       |       "U"     |" ');
	console.log( '    |       57       |       "V"     |" ');
	console.log( '    |       58       |       "W"     |" ');
	console.log( '    |       59       |       "X"     |" ');
	console.log( '    |       60       |       "Y"     |" ');
	console.log( '    |       61       |       "Z"     |" ');
	console.log( '    |       61       |       "?"     |" ');
	console.log( '    |       62       |       "!"     |" ');
	console.log( '    |       63       |       ":"     |" ');
	console.log( '    |       64       |       ";"     |" ');
	console.log( '    |       65       |       ","     |" ');
	console.log( '    |       66       |       "."     |" ');
	console.log( '    |       67       |       "&"     |" ');
	console.log( '    |       68       |       "#"     |" ');
	console.log( '    |       69       |       "{"     |" ');
	console.log( '    |       70       |       "}"     |" ');
	console.log( '    |       71       |       "("     |" ');
	console.log( '    |       72       |       ")"     |" ');
	console.log( '    |       73       |       "["     |" ');
	console.log( '    |       74       |       "]"     |" ');
	console.log( '    |       75       |       "="     |" ');
	console.log( '    |       76       |       "+"     |" ');
	console.log( '    |       77       |       "-"     |" ');
	console.log( '    |       78       |       "*"     |" ');
	console.log( '    |       79       |       "/"     |" ');
	console.log( '    |       80       |       "@"     |" ');
	console.log( '    |       81       |       "%"     |" ');
	console.log( '    |       82       |       "$"     |" ');
	console.log( '    |       83       |       "£"     |" ');
	console.log( '    |       84       |       ">"     |" ');
	console.log( '    |       85       |       "é"     |" ');
	console.log( '    |       86       |       "è"     |" ');
	console.log( '    |       87       |       "à"     |" ');
	console.log( '    |       88       |       "ç"     |" ');
	console.log( '    |       89       |       "ù"     |" ');
	console.log( '    |      100       |       "ô"     |" ');
	console.log( '    |      101       |       "î"     |" ');
	console.log( '    |      102       |       "ê"     |" ');
	console.log( '    |      103       |       "û"     |" ');
	console.log( '    |      104       |       "â"     |" ');
	console.log( '    |      105       |       "ö"     |" ');
	console.log( '    |      106       |       "ë"     |" ');
	console.log( '    |      107       |       "ä"     |" ');
	console.log( '    |      108       |       "ï"     |" ');
	console.log( '    |      109       |       "ü"     |" ');
	console.log( '    |      110       |       "µ"     |" ');
	console.log( '    ----------------------------------" ');

}

var myArgs = [];
if( PATH.basename( process.argv[ 1 ] ).toLowerCase() == 'tmx2bas.js' )
{	
	var myArgs = process.argv.slice(2);
	if( myArgs.length > 0 && PATH.basename( __filename ).toLowerCase() == 'tmx2bas.js' )
	{
		console.log( 'TMX2BAS v1.0-1 by Baptiste Bideaux.' );
		console.log( '------------------------------------' );
		console.log( ' ' );	

		tmxFile = myArgs[ 0 ];

		outputPath = PATH.dirname( tmxFile ) + '/output.bas';
		for( var a = 1; a < myArgs.length; a++ )
		{
			var arg = myArgs[ a ];
			if( arg.indexOf( '-' ) != 0 )
			{
				console.log( 'ERROR: Invalid argument in ' + arg );
				process.exit( 1 );
			}

			if( arg.indexOf( '=' ) < 2 )
			{
				console.log( 'ERROR: Invalid argument in ' + arg );
				process.exit( 1 );
			}
			var command = arg.split( '=' )[ 0 ].toLowerCase();
			var value = arg.split( '=' )[ 1 ];
			if( value && command != '-o' )
			{
				value = value.toLowerCase();
			}			
			switch( command.toLowerCase() )
			{
				case '-o':
					outputPath = value;
					break;
					
				case '-c':
					compression = value.toLowerCase();
					break;
				
				case '-rl':
					rscriptLabels = value.toLowerCase();
					break;

				case '-max':
					maxData = parseInt( value );
					break;
					
				case '-f':
					formatData = value.toLowerCase();
					break;
					
				case '-h':
					showHelp();
					break;
			}
		}
		convertTMX();
	}
}

function checkParams()
{
    if( !FS.existsSync( tmxFile ) )
    {
        console.log( 'ERROR: ' + tmxFile + ' not found.' );
        process.exit( 1 );
    }

    if( !FS.existsSync( PATH.dirname( outputPath ) ) )
    {
		console.log( 'ERROR: Invalid value in "-o" argument. ' + PATH.dirname( outputPath ) + ' path not exists.' );
		process.exit( 1 );
	}
	
	if( compression != 'none' && compression != 'rle' )
	{
		console.log( 'Compression type not recognized. Must be "none" or "rle". No compression used.' );
		compression = 'none';
	}
	
	if( rscriptLabels != 'no' && rscriptLabels != 'yes' )
	{
		console.log( 'RSCRIPT labels value not recognized. Must be "no" or "yes". No labels added.' );
		rscriptLabels = 'no';
	}
	
	if( isNaN( maxData ) || maxData < 1 )
	{
		console.log( 'Maximum data value not recognized. Must be a positive integer. 8 used.' );
		maxData = 8;
	}	
	
	if( formatData != 'dec' && formatData != 'hex' && formatData != 'str' )
	{
		console.log( 'Format data not recognized. Must be "dec", "hex" or "str". "dec" used.' );
		typeData = 'dec';
	}	
}

function convertTMX()
{
	checkParams();
	try
	{
		var data = FS.readFileSync( tmxFile );
		var lines = data.toString().split( "\r\n" );
		if( lines )
		{
			var code = "";
			var opened = false;
			var m = 0;
			datas = [];
			for( var l = 0; l < lines.length; l++ )
			{
				var line = lines[ l ].trim();
				if( line == '<data encoding="csv">' )
				{
					line = '';
					datas = [];
					m++;
					code = code + "; map #" + m + "\r\n";
					if( rscriptLabels == 'yes' )
					{
						code = code + "#label map" + m + "$\r\n";
					}
					opened = true;
				}

				if( line == '</data>' )
				{
					line = '';
					opened = false;
					ln = 0;

					code = code + convertData( datas ) + '\r\n';
				}

				if( line != '' && opened )
				{
					var values = line.split( ',' );
					if( values )
					{	
						for( var v = 0; v < values.length; v++ )
						{
							var value = -1;
							if( values[ v ] != '' )
							{				
								value = parseInt( values[ v ] );
								if( !isNaN( value ) )
								{
									datas.push( value );
								}
							}
						}						
					}
				}
			}
		}
		FS.writeFileSync( outputPath, code, 'utf8' );
		console.log( 'TMX Code BASIC created in ' + outputPath );
		return true;
	}
	catch( e )
	{
		console.log( e );
		return false;
	}
}

function applyRLECompression( datas )
{
	var newDatas = [];
	var curData = -1;
	var nData = 0;
	var maxPacker = 255;
	
	if( formatData == 'str' )
	{
		maxPacker = 110;
	}
	
	for( var d = 0 ; d < datas.length; d++ )
	{
		if( curData != -1 )
		{
			if( datas[ d ] == curData && nData < maxPacker )
			{
				nData++;
			}
			else
			{
				newDatas.push( nData );
				newDatas.push( curData );
				curData = datas[ d ];
				nData = 1;
			}
		}
		else
		{
			curData = datas[ d ];
			nData = 1;
		}
	}
	
	if( nData > 0 )
	{
		newDatas.push( nData );
		newDatas.push( curData );		
	}
	return newDatas;
}

function generateDEC( datas )
{
	var res = "";
	var line = "";
	var n = 0;
	for( var d = 0; d < datas.length; d++ )
	{
		if( n == maxData )
		{
			res = res + "DATA " + line + "\r\n";
			line = "";
			n = 0;
		}
		
		if( line != "" )
		{
			line += ",";
		}
		
		line = line + datas[ d ];
		n++;
	}

	if( line != "" )
	{
		res = res + "DATA " + line + "\r\n";
	}
	
	return res;
}

function generateHEX( datas )
{
	var res = "";
	var line = "";
	var n = 0;
	for( var d = 0; d < datas.length; d++ )
	{
		if( n == maxData )
		{
			res = res + "DATA " + line + "\r\n";
			line = "";
			n = 0;
		}
		
		if( line != "" )
		{
			line += ",";
		}
		
		if( datas[ d ] != -1 )
		{
			value = datas[ d ].toString( 16 );
			if( ( value.length % 2 ) > 0 )
			{
				value = "0" + value;
			}		
			line = line + value.toUpperCase();
			n++;
		}
	}

	if( line != "" )
	{
		res = res + "DATA " + line + "\r\n";
	}
	
	return res;
}

function generateSTR( datas )
{
	
	var res = "";
	var line = "";
	var n = 0;
	for( var d = 0; d < datas.length; d++ )
	{
		if( n == maxData )
		{
			res = res + 'DATA "' + line + '"\r\n';
			line = "";
			n = 0;
		}
		
		if( datas[ d ] != -1 )
		{
			var dt = datas[ d ];
			line = line + String.fromCharCode( dt );
			n++;

		}
	}

	if( line != "" )
	{
		res = res + 'DATA "' + line + '"\r\n';
	}
	
	return res;
}

function convertData( datas )
{
	if( compression = "rle" )
	{
		datas = applyRLECompression( datas );
	}
	
	var res = '';

	if( formatData == "dec" )
	{
		res = generateDEC( datas );
	}

	if( formatData == "hex" )
	{
		res = generateHEX( datas ); 
	}

	if( formatData == "str" )
	{
		res = generateSTR( datas );
	}

	return res;
	
	var values = line.split( ',' );
	if( values )
	{
		if( w == -1 )
		{
			w = values.length;
		}
		for( var v = 0; v < w; v++ )
		{
			var value = -1;
			if( values != '' )
			{				
				value = parseInt( values[ v ] );
			}
			
			if( value != -1 && !isNaN( value ) )
			{
				
				if( value != -1 )
				{
					value = value.toString( 16 );
					if( ( value.length % 2 ) > 0 )
					{
						value = "0" + value;
					}
					res = res + value.toUpperCase();
				}
			}
		}
	}
	
	return '"' + res + '"';
}
