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
};

var Loader = 
{
    code: [],
    numLine: 1,
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    n1:0,
    n2:-1,
    n3:-1,
    arrVars: {},
    arrConstants: {},
    arrLabels: {},
    load: function( config, sourcePath, options )
    {
        var srcCode = '';
        if( !FS.existsSync( sourcePath ) )
        {
            console.log( 'Loading error: File "' + sourcePath + '" not found.' );
            process.exit( 1 );
        }

        var buffer = FS.readFileSync( sourcePath );
        srcCode = srcCode + buffer.toString();
        var lines = srcCode.split( '\r\n' );
        if( lines )
        {
            for( var l = 0; l < lines.length; l++ )
            {
                var line = lines[ l ].trim();
                if( line.substring( 0, 1 ) == ';' )
                {
                    line = '';
                }

                if( options && options.compress )
                {
                    if( line.substring( 0, 3 ).toLowerCase() == 'rem' || line.substring( 0, 1 ) == "'" )
                    {
                        line = '';
                    }                    
                }

                if( line.substring( 0, 9 ).toLowerCase() == '#include ' )
                {
                    var name = line.substring( 9, line.length ).trim();
                    name = name.strReplace( '"', '' );
                    if( !FS.existsSync( name ) )
                    {
                        console.log( 'Include error in "' + sourcePath + '" at line ' + ( l + 1 ) + ': File "' + name + '" does not exists.' );
                        process.exit( 1 );
                    }
                    this.load( config, name );
                    line = '';
                }

                if( line.substring( 0, 5 ).toLowerCase() == '#var ' )
                {
                    var name = line.substring( 5, line.length ).trim().toLowerCase();
                    if( this.arrVars[ name ] )
                    {
                        console.log( 'Variable error in "' + sourcePath + '" at line ' + ( l + 1 ) +': Variable "' + name + '" already declared.' );
                        process.exit( 1 );
                    }
                    this.arrVars[ name ] = this.getName( name );
                    line = '';
                }

                if( line.substring( 0, 7 ).toLowerCase() == '#const ' )
                {
                    var part = line.substring( 7, line.length ).trim();
                    var parts = part.split( '=' );
                    if( parts )
                    {
                        var name = parts[0].toLowerCase().trim();
                        var value = parts[1].toLowerCase().trim();
                        if( this.arrConstants[ name ] )
                        {
                            console.log( 'Constant error  in "' + sourcePath + '" at line ' + ( l + 1 ) + ': Constant "' + name + '" already declared.' );
                            process.exit( 1 );
                        }
                        this.arrConstants[ name ] = value;
                    }
                    line = '';
                }
                
                if( line.substring( 0, 7 ).toLowerCase() == '#label ' )
                {
                    var name = line.substring( 7, line.length ).trim().toLowerCase();
                    if( this.arrLabels[ name ] )
                    {
                        console.log( 'Label error in "' + sourcePath + '" at line ' + ( l + 1 ) + ': Label "' + name + '" already exists.' );
                        process.exit( 1 );
                    }
                    this.arrLabels[ name ] = this.numLine;
                    line = '';
                }

                if( line.trim() != '' )
                {
                    this.code.push( '>> ' + sourcePath + ',' + ( l + 1 ) );
                    this.code.push( this.numLine + ' ' + line );
                    this.numLine++;
                }
            }
        }
    },

    insertAutoIncludes: function( config )
    {
        if( config.includes && config.includes.length )
        {
            for( var i = 0; i < config.includes.length; i++ )
            {
                var path = __dirname + '/syntax/' + config.path + '/inc/' + config.includes[ i ];
                if( !FS.existsSync( path ) )
                {
                    console.log( 'Configuration error: File "' + path + '" not found.' );
                    process.exit( 1 );
                }
                this.load( config, path );
            }
        }
    },

    replaceTagsByValues: function( config, options )
    {
        var newCode = new Array();
        var nl = 1;
        if( this.code.length > 0 )
        {
            for( var l = 0; l < this.code.length; l++ )
            {
                var line = this.code[ l ];
                if( line.substring( 0, 3 ) == '>> ' )
                {
                    line = '';
                }
                else
                {
                    var self = this;
                    Object.keys( self.arrVars ).forEach( function( key )
                    {
                        var value = self.arrVars[ key ].toUpperCase();
                        self.code[ l ] = self.code[ l ].strReplace( '!' + key, value );  
                        self.code[ l ] = self.code[ l ].strReplace( '!' + key.toLowerCase(), value );  
                        self.code[ l ] = self.code[ l ].strReplace( '!' + key.toUpperCase(), value );  
                    } );

                    Object.keys( self.arrConstants ).forEach( function( key )
                    {
                        var value = self.arrConstants[ key ].toUpperCase();
                        self.code[ l ] = self.code[ l ].strReplace( '&' + key, value );  
                        self.code[ l ] = self.code[ l ].strReplace( '&' + key.toLowerCase(), value );  
                        self.code[ l ] = self.code[ l ].strReplace( '&' + key.toUpperCase(), value );  
                    } );

                    Object.keys( self.arrLabels ).forEach( function( key )
                    {
                        var value = self.arrLabels[ key ];
                        self.code[ l ] = self.code[ l ].strReplace( '@' + key, value );  
                        self.code[ l ] = self.code[ l ].strReplace( '@' + key.toLowerCase(), value );  
                        self.code[ l ] = self.code[ l ].strReplace( '@' + key.toUpperCase(), value );  
                    } );
                }

                if( line != '' )
                {
                    if( options && options.compress && config && config.compress )
                    {
                        self.code[ l ] = config.compress( self.code[ l ] );
                    }

                    if( config && config.numChar && self.code[ l ].length > config.numChar )
                    {
                        console.log( 'Warning in "' + options.outputPath + '" at line ' + ( nl ) + ': Line too long.' );
                    }

                    newCode.push( self.code[ l ] );
                    nl++;
                }
            }
            self.code = newCode;
        }
    },

    getName: function( vname )
    {
        var sym = vname.substring( vname.length - 1, vname.length );
        if( sym != '$' && sym !='#' )
        {
            sym = '';
        }
        var a1 = this.letters.substring( this.n1, this.n1 + 1);
        var a2 = '';
        if( this.n2 > -1 )
        {
            a2 = this.letters.substring( this.n2, this.n2 + 1 );
        }
        var a3 = '';
        if( this.n3 > -1)
        {
            a3 = this.letters.substring( this.n3, this.n3 + 1 );
        }
        var varName = a1+a2+a3+sym;
        this.n1++;
        if( this.n1 > 25 )
        {
            this.n1=0;
            this.n2++;
            if( this.n2 > 25 )
            {
                this.n2=0;
                this.n3++;
                if( this.n3 > 25 )
                {
                    console.log( "Variables error: Too many declared variable." );
                    process.exit( 1 );
                }
            }
        }
        return varName.toUpperCase(); 
    }
}
module.exports = Loader;