import { basename, dirname } from 'path';
import { existsSync, writeFileSync, readFileSync } from 'fs';

var fileSource = undefined;
var o = "./code.bas";
var nl = 1;
var vl1 = 0;
var vn1 = -1;
var vl2 = -1;
var vn2 = -1;
var vars = [];
var labels = [];
var labelNames = {};
var vars = [];
var varNames = {};
var constants = [];
var constNames = {};

var compress = false;
var code = '';
var lines = [];

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

function rscript( options )
{
	fileSource = options.source;
	if( fileSource == undefined )
	{
		return false;
	}
	
	compress = (options.c && options.c=="yes")?true:false;
	o = (options.o)?options.o:"./output.bas";
	
	if( !transpileFile( fileSource ) )
	{
		return false;
	}
	
	return finalizeCode();
}
const _rscript = rscript;
export { _rscript as rscript };

var myArgs = [];
if( basename( process.argv[ 1 ] ).toLowerCase() == 'rscript.js' )
{
	console.log( 'RSCRIPT v1.0-4 by Baptiste Bideaux' );
	console.log( '----------------------------------' ); 
	console.log( '' );

	myArgs = process.argv.slice(2);
	
    fileSource = myArgs[ 0 ];
    if( !existsSync( fileSource ) )
    {
        console.log( 'ERROR: ' + fileSource + ' not found.' );
        process.exit( 1 );
    }

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
            case '-o':
                o = value;
                break;
				
            case '-c':
                if( value == 'yes' )
                {
					compress = true;
                }
                break;
				
            case '-h':
				showHelp();
				process.exit( 0 );
                break;
        }
		
		if( !transpileFile( fileSource ) )
		{
			return false;
		}
		return finalizeCode();
    }
}

function checkParams()
{
	if( !existsSync( dirname( o ) ) )
    {
		console.log( 'ERROR: Invalid value in "-o" argument. ' + dirname( o ) + ' path not exists.' );
        return false;
    }
	return true;
}

function finalizeCode()
{
	code = generateCode();
	if( code === false )
	{
		return false;
	}
	
	if( compress )
	{
		code = code.strReplace( 'then goto', 'then' );
		code = code.strReplace( 'THEN GOTO', 'then' );
		code = code.strReplace( 'Then goto', 'then' );
		code = code.strReplace( 'then Goto', 'then' );
		code = code.strReplace( 'Then Goto', 'then' );

		code = code.strReplace( " ", "" );
		code = code.strReplace( "_", " " );
		code = code.strReplace( "PRINT", '?' );
		code = code.strReplace( "print", '?' );
		code = code.strReplace( "Print", '?' );
		
		for( var i = 32; i< 123;i++)
		{
			if( i != 34 && i != 95 )
			{
				code = code.strReplace( '*chr$(' + i + ')', '"' + String.fromCharCode( i ) + '"' );
				code = code.strReplace( '*CHR$(' + i + ')', '"' + String.fromCharCode( i ) + '"' );
				code = code.strReplace( '*Chr$(' + i + ')', '"' + String.fromCharCode( i ) + '"' );
				code = code.strReplace( '*chr$( ' + i + ' )', '"' + String.fromCharCode( i ) + '"' );
				code = code.strReplace( '*CHR$( ' + i + ' )', '"' + String.fromCharCode( i ) + '"' );
				code = code.strReplace( '*Chr$( ' + i + ' )', '"' + String.fromCharCode( i ) + '"' );
			}
			
		}
		code = code.strReplace( '*+', '|' );
		code = code.strReplace( ' *+', '|' );
		code = code.strReplace( '"|"', '' );
		code = code.strReplace( '|', '' );
	}
	
	// Verifie le code
	var lines = code.split( "\r\n" )
	if( lines )
	{
		for( var l = 0; l < lines.length; l++ )
		{
			if( ( lines[ l ].length - lines[ l ].indexOf( " " ) )  > 255 )
			{
				console.log( 'WARN: Line too long at line ' + ( l + 1 ) + ' (' + ( lines[ l ].length - lines[ l ].indexOf( " " ) ) + ' characters)' );
			}
		}
	}

	writeFileSync( o, code, 'utf8' );
	console.log( 'Code BASIC created in ' +  o );
	return true;
}

function generateCode()
{
	var code = "";
	var finalLine = '';
	var added = false;
	var nl = 1;
	for( var l = 0; l < lines.length; l++ )
	{	
		var line = lines[ l ];

		if( line.substring( 0, 7 ).toLowerCase() == "#label " )
		{
			var part = line.split( " " );
			if( part.length < 2 )
			{
				console.log( 'ERROR: Label name undefined.' );
				return false;                    
			}

			var labelInfo = 
			{ 
				name: part[ 1 ],
				line: nl
			}

			if( labelNames[ labelInfo.name ] )
			{
				console.log( 'ERROR: Label ' + labelInfo.name + ' already exists.' );
				return false;                      
			}
			labels.push( labelInfo );
			labelNames[ labelInfo.name ] = true;
			line = '';
		}
		
		if( line != '' )
		{
			for( var v = 0; v < vars.length; v++ )
			{
				line = line.strReplace( '!' + vars[ v ], varNames[ vars[ v ] ].toUpperCase() );
				line = line.strReplace( '!' + vars[ v ].toUpperCase(), varNames[ vars[ v ] ].toUpperCase() );	
				line = line.strReplace( '!' + vars[ v ].toLowerCase(), varNames[ vars[ v ] ].toUpperCase() );
			}

			for( var v = 0; v < constants.length; v++ )
			{
				line = line.strReplace( '!' + constants[ v ], constNames[ constants[ v ] ].value );
				line = line.strReplace( '!' + constants[ v ].toUpperCase(), constNames[ constants[ v ] ].value );	
				line = line.strReplace( '!' + constants[ v ].toLowerCase(), constNames[ constants[ v ] ].value );
			}
			
			if( line.substring( line.length - 1, line.length ) == '/' )
			{

				if( finalLine != '' )
				{
					finalLine = finalLine + ':' + line.substring( 0, line.length - 1 );
				}
				else
				{
					finalLine = line.substring( 0, line.length - 1 );
				}
				added = false;
			}
			else
			{
				if( finalLine == '' )
				{
					finalLine = line;
				}
				else
				{
					finalLine = finalLine + ':' + line;						
				}
				added = true;
			}
		}
		
		if( finalLine != '' && added )
		{
			code = code + nl + " " + finalLine + "\r\n";
			finalLine = "";
			nl = nl + 1;
			added = false;
		}		
	}
	for( var l = 0; l < labels.length; l++ )
	{
		var label = labels[ l ];
		code = code.strReplace( '@' + label.name, label.line );
	}
	return code;
}


function transpileFile( file, cb )
{
	if( !checkParams() )
	{
		return false;		
	}
	
    if( !existsSync( file ) )
    {
        console.log( 'ERROR: ' + file + ' not found.' );
        return false;;        
    }

    var data = readFileSync( file, 'utf8' ).toString();
    var dataLines = data.split( "\r" );
	
    if( dataLines )
    {
        for( var l = 0; l < dataLines.length; l++ )
        {
            var line = dataLines[ l ];
            line = line.strReplace( "\n", "" );
            line = line.trim();
            
            if( line.substring( 0, 1 ) == ";" )
            {
                line = '';
            }
            
			if( line.substring( 0, 4 ).toLowerCase() == "rem " && compress )
            {
                line = '';
            }

			if( line.substring( 0, 1 ) == "'" && compress )
            {
                line = '';
            }
			
            if( line.substring( 0, 9 ).toLowerCase() == "#include " )
            {
                var part = line.split( " " );
                if( part.length < 2 )
                {
                    console.log( 'ERROR: File not defined for include.' );
                    return false;                 
                }

                var incFile = dirname( file ) + "/" + part[ 1 ].strReplace( ".", "/" ) + ".rscript";
                if( !transpileFile( incFile ) )
				{
					return false;
				}
                line = '';
            }

            if( line.substring( 0, 8 ).toLowerCase() == "#plugin " )
            {
                var part = line.split( " " );
                if( part.length < 3 )
                {
                    console.log( 'ERROR: #plugin argument error.' );
					process.exit( 1 );                   
				}

				if( !existsSync ('./plugins/' + part[ 1 ] + '.js' ) )
				{
                    console.log( 'ERROR: Plugin "' + part[ 1 ] + '" not found.' );
                    process.exit( 1 ); 				
				}

				try
				{
					var { plugin } = require( './plugins/' + part[ 1 ] + '.js' );
				}
				catch( error )
				{
                    console.log( 'ERROR: Loading error for plugin "' + part[ 1 ] + '".' );
                    process.exit( 1 );				
				}

				if( plugin )
				{
					var options = JSON.parse( '{' + part[ 2 ] + '}' );
					plugin( options, function( error )
					{
						if( error )
						{
							console.log( 'ERROR: "' + part[ 1 ] + ' plugin failed!' );
							process.exit( 1 );
						}
					} );					
				}
				line = "";
			}

			if( line.substring( 0, 5 ).toLowerCase() == "#var " )
            {
                var part = line.split( " " );
                if( part.length < 2 )
                {
                    console.log( 'ERROR: Variable name undefined.' );
                    return false;                    
                }

                if( varNames[ part[ 1 ] ] )
                {
                    console.log( 'ERROR: Variable ' + varNames[ part[ 1 ] ] + ' already declared' );
                    return false;                      
                }
				
				var letters = "abcdefghijklmnopqrstuvwxyz";
				var nums = "0123456789";
				var name = letters[ vl1 ];
				vl1++;
				if( vl1>25)
				{
					vl1=0;
					vn1=0;
				}
				
				if(vn1 > -1)
				{
					name = name + nums[ vn1 ];
					vn1++;
					if(vn1 > 9 )
					{
						vn1=0;
						vl2=0;
					}
				}


				if(vl2 > -1)
				{
					name = name + letters[ vl2 ];
					vl2++;
					if(vl2>25)
					{
						vl2=0;
						vn2=0;
					}
				}

				if(vn2 > -1)
				{
					name = name + nums[ vn2 ];
					vn2++;
					if( vn2>9)
					{
						console.log( 'ERROR: Too many variables' );
						process.exit(1);
					}
				}
				
				if( part[ 1 ].indexOf( "$" ) > -1 )
				{
					name = name + '$';
				}
				vars.push( part[ 1 ] );
				varNames[ part[ 1 ] ] = name;
				line='';
			}
            
			if( line.substring( 0, 7 ).toLowerCase() == "#const " )
            {
                var part = line.split( " " );
                if( part.length < 2 )
                {
                    console.log( 'ERROR: Constant name undefined.' );
                    return false;                    
                }

				var values = part[1].split('=');
				if( values.length < 2 )
				{
                    console.log( 'ERROR: Constant value undefined.' );
                    return false;
				}
				
                if( constNames[ values[0].trim() ] )
                {
                    console.log( 'ERROR: Constant ' + values[0].trim() + ' already exists.' );
                    return false;                      
                }
				
				constants.push( values[0].trim() );
				constNames[ values[0].trim() ] = { value: values[1].trim() };
				line='';
			}
			
			if( line != '' )
			{
                lines.push( line );
            }

        }
    }
	return true;
}

function showHelp()
{
    console.log( 'Syntax in command line:' );
    console.log( 'rscript.js <filesource> [-h] [-o=<output>] [-c=<no|yes>]' );
    console.log( '<filesource>: Absolute path of the main source file.' );
    console.log( '-h: This help' );
    console.log( '-c: Code compression. Remove all unnecessary spaces, empty lines and the all comments. Must be "no" or "yes" ("no" by default)' );
    console.log( '-o: Output path for the generated BASIC file. (directory of the sourcefile by default)' );
}
