const PATH = require( 'path' );
const FS = require( 'fs' );
const LOADER = require( './loader.js' );
const VERSION = '1.0.0';
const showHelp = function()
{
    console.log( 'transpiler [-h] [-v] [-c yes|no|true|false] -m aquarius|cpc|thomson|exelvision|vg500|alice -o output-file -s source' ); 
    console.log( 'BASIC Transpiler commands line:' );
    console.log( '\t-h: Shows this help.' );
    console.log( '\t-v: Shows the Transpiler version.' );
    console.log( '\t-c: Uses the code compression (active by default). (true/false or yes/no)' );
    console.log( '\t\tIf compression is enabled, the transpiler will attempt to optimize' );
    console.log( '\t\tthe output BASIC code to make the program less memory intensive.' );
    console.log( '\t\tVariable names declared by the #VAR tag and constant names declared by the #CONST tag will be rewritten.' );
    console.log( '\t\tSome unnecessary spaces will be removed and comment lines will be ignored.' );
    console.log( '\t' );
    console.log( '\t-m: Target machine.' );
    console.log( '\t\t"aquarius": Transpiles for the Mattel Aquarius Basic (S1 & S2).' );
    console.log( '\t\t"cpc": Transpiles for the Amstrad CPC Locomotive Basic (464,664 & 6128).' );
    console.log( '\t\t"thomson": Transpiles for the Thomson BASIC 1 (MO5 & TO7/TO7-70).' );
    console.log( '\t\t"vg5000": Transpiles for the VG5000µ Computers BASIC (Philips, Radiola).' );    
    console.log( '\t\t"exelvision": Transpiles for the EXL-100 & EXELTEL BASIC.' );
    console.log( '\t\t"alice": Transpiles for the Matra Alice32/90.' ); 
    console.log( '\t\t"amiga": Transpiles for the Commodore AMIGA.' );    
    console.log( '\t' );    
    console.log( '\t-o: The output path.' );
    console.log( '\t-s: The source file to transpile.' );
}

console.log( 'BASIC Transpiler v' + VERSION );
console.log( '(c)2023 Baptiste Bideaux.');
console.log( '=========================');

if( process.argv.length === 2 )
{
    showHelp();
    process.exit( 1 );
}

var options = 
{
    compress: true,
    machine: '',
    outputPath: '',
    sourcePath: ''
};

for( var a = 2; a < process.argv.length; a++ )
{
    var arg = process.argv[ a ].toLowerCase();
    switch( arg )
    {
        case '-h':
            showHelp();
            process.exit( 0 );
            break;

        case '-v':
            console.log( VERSION );
            process.exit( 0 );
            break;
        
        case '-c':
            if( a == process.argv.length )
            {
                console.log( 'Argument error: Compression value missing.' );
                process.exit( 1 );
            }

            var value = process.argv[ a + 1 ].toLowerCase();
            if( value != 'false' && value != 'true' && value != 'yes' && value != 'no' )
            {
                console.log( 'Argument error: Bad Compression value. Must be true, false, yes or no.' );
                process.exit( 1 );                
            }

            if( value == 'false' || value == 'no' )
            {
                options.compress = false;
            }
            else
            {
                options.compress = true;
            }
            a++;
            break

        case '-m':
            if( a == process.argv.length )
            {
                console.log( 'Argument error: Machine value missing.' );
                process.exit( 1 );
            }

            var value = process.argv[ a + 1 ].toLowerCase();
            if( !FS.existsSync( __dirname + '/syntax/' + value + '/config.js' ) )
            {
                console.log( 'Argument error: Machine "' + value + '" not supported.' );
                process.exit( 1 );                
            }

            options.machine = value;
            a++;
            break

        case '-o':
            if( a == process.argv.length )
            {
                console.log( 'Argument error: Output value missing.' );
                process.exit( 1 );
            }

            var value = process.argv[ a + 1 ].toLowerCase();
            options.outputPath = value;
            a++;
            break

        case '-s':
            if( a == process.argv.length )
            {
                console.log( 'Argument error: Source value missing.' );
                process.exit( 1 );
            }

            var value = process.argv[ a + 1 ].toLowerCase();
            if( !FS.existsSync( value ) )
            {
                console.log( 'Argument error: Source "' + value + '" not found.' );
                process.exit( 1 );                
            }

            options.sourcePath = value;
            a++;
            break                              
    }
}

if( options.machine.trim() == '' )
{
    console.log( 'Argument error: Target Machine not defined' );
    process.exit( 1 );     
}

if( options.outputPath.trim() == '' )
{
    options.outputPath = 'output.bas';
}

if( options.sourcePath.trim() == '' )
{
    console.log( 'Argument error: Source not defined' );
    process.exit( 1 );     
}

const Config = require( __dirname + '/syntax/' + options.machine + '/config.js' );
console.log( 'Compression: ' + options.compress );
console.log( 'Machine: ' + Config.name );
console.log( 'Output: ' + options.outputPath );
console.log( 'Source: ' + options.sourcePath );
console.log( '==========================================' );
if( options.executeBefore && options.executeBefore.trim() != '' )
{
    console.log( 'Executing script "Before"...')
    var cmd = options.executeAfter.trim().strReplace( '%1', options.outputPath );
    exec( cmd, (error, stdout, stderr ) => {
        if( error )
        {
            console.log( `Execution error: ${ error.message }` );
            return;
        }

        if( stderr )
        {
            console.log( `Execution stderr: ${ stderr }` );
            return;
        }

        LOADER.insertAutoIncludes( Config );
        LOADER.load( Config, options.sourcePath, options );
        transpile();
        LOADER.replaceTagsByValues( Config, options );
        FS.writeFileSync( options.outputPath, LOADER.code.join('\r\n' ) );
        console.log( 'File saved in "' + options.outputPath + '".' );
    } );
}
else
{
    LOADER.insertAutoIncludes( Config );
    LOADER.load( Config, options.sourcePath, options );
    transpile();
    LOADER.replaceTagsByValues( Config, options );
    FS.writeFileSync( options.outputPath, LOADER.code.join('\r\n' ) );
    console.log( 'File saved in "' + options.outputPath + '".' );
}

if( options.executeAfter && options.executeAfter.trim() != '' )
{
    console.log( 'Executing script "After"...')
    var cmd = options.executeAfter.trim().strReplace( '%1', options.outputPath );
    exec( cmd, (error, stdout, stderr ) => {
        if( error )
        {
            console.log( `Execution error: ${ error.message }` );
            return;
        }

        if( stderr )
        {
            console.log( `Execution stderr: ${ stderr }` );
            return;
        }

        console.log( 'Finish...' );
    } );
}

function transpile()
{
    var code = LOADER.code;
    var src = '';
    var ln = 1;
    if( code && code.length > 0 )
    {
        for( var l = 0; l < code.length; l++ )
        {
            var line = code[ l ];
            if( line.substring( 0, 3 ) == '>> ' )
            {
                src = line.substring( 3, line.length ).split( ',' );
                ln = src[ 1 ];
                src = src[ 0 ]; 
            }
            else
            {
                var cuts = line.split( ':' );
                if( cuts && cuts.length > 0 )
                {
                    line = transpileLine( src, ln, cuts );
                    code[ l ] = line;

                }
            }
        }
    }
}

function transpileLine( src, ln, cuts )
{
    var line = '';
    var numLine = '';
    if( Config.codeLine && Config.codeLine.lineNumber )
    {
        numLine = cuts[ 0 ].substring( 0, cuts[ 0 ].indexOf( " " ) ).trim(); 
        cuts[ 0 ] = cuts[ 0 ].substring( cuts[ 0 ].indexOf( " " ), cuts[ 0 ].length ).trim();
    }
    for( var c = 0; c < cuts.length; c++ )
    {
        line = line + transpileCommand( src, ln, cuts[ c ].trim() );
        if( c < cuts.length - 1 )
        {
            line = line + ':';
        }
    }
    console.log( line );
    if( Config.codeLine && Config.codeLine.lineNumber )
    {
        return numLine + " " + line;
    }
    else
    {
        return line;
    }
}

function transpileCommand( src, ln, cmd )
{
    var TOKEN = undefined;
    var parts = cmd.split( " " );
    var keyw = '';
    if( parts )
    {
        keyw = parts[ 0 ].trim().toLowerCase();
        if( FS.existsSync( __dirname + '/syntax/' + Config.path + '/language/' + keyw.trim() + '.js' ) )
        {
            TOKEN = require( __dirname + '/syntax/' + Config.path + '/language/' + keyw.trim() + '.js' );
            if( TOKEN && TOKEN.transpile )
            {
                cmd = TOKEN.transpile( src, ln, Config, cmd, options );
            }
        }
    }
    return cmd;
}
