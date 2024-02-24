const FS = require( 'fs' );
const PATH = require( 'path' );
const { createCanvas, loadImage } = require( 'canvas' );

var imgFile = "";
var canvas = undefined;
var ctx = undefined;
var imgSource = undefined;
var n = 128;
var c = '#FFFFFF';
var s = 0;
var m = 'cpc';
var ns = 32;
var o = PATH.dirname( imgFile ) + '/output.bas';
var cl = "no";
var eteg = "et";

var captureSettings = 
{
    'cpc':
    {
        width: 8,
        height: 8,
		hexa: true,
        headerBASIC: 
        [
            'SYMBOL AFTER %NS-1',
            'FOR I=0 TO %N-1',
            'READ A$,B$,C$,D$,E$,F$,G$,H$',
            'SYMBOL %NS+I,VAL("&"+A$),VAL("&"+B$),VAL("&"+C$),VAL("&"+D$),VAL("&"+E$),VAL("&"+F$),VAL("&"+G$),VAL("&"+H$)',
            'NEXT I'
        ],
        dataBASIC: 'DATA %1,%2,%3,%4,%5,%6,%7,%8',
        endBASIC: undefined
    },

    'thomson':
    {
        width: 8,
        height: 8,
		hexa: true,
        headerBASIC: 
        [
            'CLEAR ,,%N',
            'FOR I=0 TO %N-1',
            'READ A$,B$,C$,D$,E$,F$,G$,H$',
            'DEFGR$(%NS+I)=VAL("&H"+A$),VAL("&H"+B$),VAL("&H"+C$),VAL("&H"+D$),VAL("&H"+E$),VAL("&H"+F$),VAL("&H"+G$),VAL("&H"+H$)',
            'NEXT I'
        ],
        dataBASIC: 'DATA %1,%2,%3,%4,%5,%6,%7,%8',
        endBASIC: undefined
    },

    'vg5000':
    {
        width: 8,
        height: 10,
		hexa: true,
        headerBASIC: undefined,
        dataBASIC: 'SET%ETEG %NS,"%1%2%3%4%5%6%7%8%9%A"',
        endBASIC: undefined
    },
	
	'exelvision':
	{
        width: 8,
        height: 10,
		hexa: true,
        headerBASIC: undefined,
        dataBASIC: 'CALL CHAR( %NS,"%1%2%3%4%5%6%7%8%9%A" )',
        endBASIC: undefined		
	},

	'alice':
	{
		width: 8,
        height: 10,
		hexa: false,
		mirror: true, 
        headerBASIC: 
        [
			/**
			 * OLD VERSION
			'RESTORE',
			'FOR !for_var1=0 TO %N',
			'READ !b,!c,!d,!e,!f,!g,!h,!i,!j,!k:POKE &r4,0',
			'!a=192+!for_var1:POKE &r1,!b:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!c:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!d:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!e:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!f:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!g:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!h:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!i:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!j:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'!a=!a+4:POKE &r1,!k:POKE &r5,!a:POKE &r0exe,48+4:GOSUB @busy',
			'NEXT !for_var1'
			*/
			'#label defchar',
			'RESTORE:!tamp=0:!nchar=0',
			'FOR !for_var1=0 TO %N-1',
			'IF !nchar>3 THEN !tamp=!tamp+1',
			'IF !nchar>3 THEN !nchar=0:GOSUB @inc_tamp',
			'!a=(192+!nchar)-4',
			'FOR !for_var2=1 TO 10:READ !b:!a=!a+4:POKE &r1,!b:POKE &r4,!tamp:POKE &r5,!a:POKE &re,48+4:GOSUB @busy:NEXT !for_var2',
			'NEXT !for_var1',
			'RETURN',		
			'#label inc_tamp',
			'!tamp=!tamp+1',
			'IF !tamp>0 THEN !tamp=!tamp+7',
			'RETURN'
        ],
        dataBASIC: 'DATA %1,%2,%3,%4,%5,%6,%7,%8,%9,%A',
        endBASIC: undefined
	}
}

function img2char( options, cb )
{
	imgFile = options.source;
	
	n = (options.n!=undefined)?options.n:127;
	c = (options.c!=undefined)?options.c:"#FFFFFF";
	o = (options.o!=undefined)?options.o:"./output.rscript";
	s = (options.s!=undefined)?options.s:0;
	m = (options.m!=undefined)?options.m:"cpc";
	ns = (options.ns!=undefined)?options.ns:32;
	cl = (options.cl!=undefined)?options.cl:"no";
	eteg= (options.eteg!=undefined)?options.eteg:"et";
	convertIMG( cb );	
}
exports.plugin = img2char;

var myArgs = [];
if( PATH.basename( process.argv[ 1 ] ).toLowerCase() == 'img2char.js' )
{

	console.log( 'IMG2CHAR v1.0-4 by Baptiste Bideaux.' );
	console.log( '------------------------------------' );
	console.log( ' ' );
	
	myArgs = process.argv.slice(2);
	if( myArgs.length > 1 )
	{

		imgFile = myArgs[ 0 ];
	
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
			var command = arg.split( '=' )[ 0 ];
			var value = arg.split( '=' )[ 1 ];
			if( value && command != '-o' )
			{
				value = value.toLowerCase();
			}
			switch( command.toLowerCase() )
			{
				case '-n':
					n = parseInt( value );
					break;

				case '-c':
					c = value;
					break;

				case '-s':
					s = parseInt( value );
					break; 

				case '-ns':
					ns = parseInt( value );
					break; 
				
				case '-cl':
					cl = parseInt( value );
					break; 
					
				case '-eteg':
					eteg = parseInt( value );
					break; 					
					
				case '-m':
					switch( value.toLowerCase() )
					{
						case 'cpc':
						case 'thomson':
						case 'vg5000':
						case 'c64':
						case 'exelvision':
						case 'alice':
							m = value.toLowerCase();
							break;
					}
					break;

				case '-o':
					o = value;
					break;                                       
			}
		}
	}
	convertIMG();
}

function checkParams()
{
	if( !FS.existsSync( imgFile ) )
	{
		console.log( 'ERROR: ' + imgFile + ' not found.' );
		return false;
	}

	var ext = PATH.extname( imgFile ).toLowerCase();
	if( ext != '.png' && ext !='.gif' && ext != '.bmp' && ext!= '.jpg' )
	{
		console.log( 'ERROR: ' + imgFile + ' format not supported.' );
		return false;
	}
		
	if( isNaN( n ) )
	{
		console.log( 'ERROR: Invalid value in "-n" argument. Integer waiting.' );
		return false;
	}
					
	if( !FS.existsSync( PATH.dirname( o ) ) )
	{
		console.log( 'ERROR: Output path not exists in "-o". ' + o + ' path not exists.' );
		return false;
	}

	if( cl != "yes" && cl != "no" )
	{
		console.log( 'ERROR: Invalid value in "-cl" argument. "no" or "yes" waiting.' );
		return false;
	}

	if( eteg != "et" && eteg != "eg" )
	{
		console.log( 'ERROR: Invalid value in "-eteg" argument. "et" or "eg" waiting.' );
		return false;
	}
	
	if( c.indexOf( '#' ) != 0 || c.length < 7 )
	{
		console.log( 'ERROR: Invalid value in "-c" argument. HTML color waiting (#000000 - #FFFFFF).' );
		return false;
	}	
	
	if( isNaN( s ) || s < 0 )
	{
		console.log( 'ERROR: Invalid value in "-s" argument. Positive integer waiting.' );
		return false;
	}
	
	if( isNaN( ns ) || ns< 0 )
	{
		console.log( 'ERROR: Invalid value in "-ns" argument. Positive integer waiting.' );
		return false;
	}	
	
	if( captureSettings[ m ] == undefined)
	{	
		console.log( 'ERROR: Invalid value in "-m" argument. ' + m + ' machine not supported.' );
		return false;
	}
	return true;
}

function convertIMG( cb )
{
	if( !checkParams() )
	{
		if( cb )cb(false);
		return;
	}

	// WARNING: Canvas package for Node has been modified to callback
	loadImage(imgFile).then((image) =>	{
		imgSource = image;
		canvas = createCanvas( image.width, image.height );
		ctx = canvas.getContext( '2d' );
		ctx.drawImage( image, 0, 0 );
		captureProcess( cb );		
	} );
	
}

function showHelp()
{
    console.log( 'Syntax in command line:' );
    console.log( 'img2char.js <imagefile> [-n=<number>] [ns=<number>] [-c=<color>] [-cl=<no|yes>] [-s=<number>] [-m=<cpc|thomson|atarist|c64|vg5000|exelvision> ] [-o=<output path>]' );
    console.log( ' imagefile: Absolute path of the image file.' );
    console.log( ' -n: The number of characters to capture ( 127 by default ).' );
    console.log( ' -ns: The index of the first user character ( 32 by default ).' );    
    console.log( ' -c: The HTML color to capture ( #FFFFFF by default ).' );
    console.log( ' -cl: Removes the characters definition in double. Must be "no" or "yes" ( "no" by default ).' );
    console.log( ' -s: Spacing between each character. (0 by default)' );
    console.log( ' -m: Target machine. Must be CPC, VG5000, EXELVISION, THOMSON or ALICE. (CPC by default)' );
    console.log( ' -o: Output path for the generated BASIC file. (directory of the imagefile by default)' );
}

function captureProcess( cb )
{
    console.log( 'Convert Image to Characters...' );
    var sx = 0;
    var sy = 0;
    var x = 0;
    var y = 0;
    var chars = [];
    var char = [];
    var line = '';
	var nchar = 0;
	var indexChar = ns;
	var memChar = [];

    while( chars.length < n )
    {    
        var col = ctx.getImageData( sx + x, sy + y, 1, 1 ).data;
        var hex = '#' + rgbToHex( col[ 0 ], col[ 1 ], col[ 2 ] );
        if( hex.toLowerCase() == c.toLowerCase() )
        {
			if( captureSettings[ m ].mirror )
			{
				line = '1' + line;
			}
			else
			{
            	line += '1';
			}
        }
        else
        {
			if( captureSettings[ m ].mirror )
			{
				line = '0' + line;
			}
			else
			{
            	line += '0';
			}
        }
        x++;

        if( x == captureSettings[ m ].width )
        {
            char.push( line );
            line = '';
            x = 0;
            y = y + 1;
            if( y == captureSettings[ m ].height )
            {
                chars.push( char );
                char = [];
                y = 0;
                sx = sx + captureSettings[ m ].width + s;
                if( sx > imgSource.width-1 )
                {
                    sx = 0;
                    sy = sy + captureSettings[ m ].height + s;
                    if( sy > imgSource.height )
                    {
						n = chars.length;
                    }
                } 
            }
        }
    }

    var code = '';
    console.log( "Generating of the BASIC code..." );
	var sep = 0;
    if ( chars && chars.length > 0 )
    {
		if( captureSettings[ m ].headerBASIC )
		{
			code = captureSettings[ m ].headerBASIC.join( "\r\n" );
			code = code + "\r\n";
		}
		
        var nd = [ '%1', '%2', '%3','%4','%5','%6','%7','%8','%9','%A' ];
        for( var ch = 0; ch < chars.length; ch++ )
        {
            var char = chars[ ch ];
            var values = [];

            var lineData = captureSettings[ m ].dataBASIC;
            for ( var l = 0; l < char.length; l++ )
            {
                var hx = parseInt( char[ l ],2 ).toString( 16 ).toUpperCase();
                if( hx.length < 2 )
                {
                    hx = "0" + hx;
                }
				if( captureSettings[ m ].hexa == false )
				{
					var hx = parseInt( char[ l ],2 )
				}
                lineData = lineData.strReplace( nd[ l ], hx );
            }

			if( memChar.indexOf( lineData ) > -1 && cl == "yes" )
			{
				lineData = '';
			}
			else
			{
				memChar.push( lineData );
			}
			
			if( lineData != '' )
			{
				
				if( m == 'vg5000' )
				{
					lineData = lineData.strReplace( "%ETEG", eteg.toUpperCase() );
				}
				lineData = lineData.strReplace( "%NS", indexChar );
				nchar++;
				code = code + lineData;
				
				if( m == 'thomson' || m == 'exelvision' || m == 'alice')
				{
					sep = 3;
				}
				
				if( sep < 2 )
				{
					code = code + "/";
				}
				sep++;
				if( sep > 2 )
				{
					sep = 0;
					code = code + "\r\n";
				}
				
				
				indexChar++;
			}
        }
    }

	if( captureSettings[ m ].endBASIC )
	{
		code = code + captureSettings[ m ].endBASIC.join( "\r\n" );
	}
	
	code = code.strReplace( "%NS", ns );
	code = code.strReplace( "%N", nchar );
	
    FS.writeFileSync( o, code + "\r\n", 'utf8' );
    console.log( 'Code BASIC created in ' + o );
	if( cb ) cb( false );
}

function rgbToHex(r, g, b){
    if ( r > 255 || g > 255 || b > 255 )
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

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