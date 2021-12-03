export class HTML{
    static div( style, content, attr ){
        return this.element( "div", attr, content, style );
    }
    static element( name, attr, content, style ){
        let e = document.createElement( name );
        if( style ){
            for( const name in style ){
                e.style[ name ] = style[ name ];
            }
        }
        if( content )
        {
            if( typeof content == "string"){
                e.innerText = content;
            } else if( Array.isArray( content )){
                content.forEach( c=>{ e.appendChild(c);});
            } else{
                e.appendChild( content );
            }
        }
        if( attr ){
            for( const name in attr ){
                e[ name ] =  attr[name];
            }
        }
        return e;
    }
    static img( src ,  css, attr ){
        return this.element( "img",  Object.assign( {src : src, attr} ), null, css);
    }
}
