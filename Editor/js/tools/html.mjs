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

    static col( name, width){
        return this.element("col", null, null, { width : width });
    }
    static colgroup( columns ){
        return this.element( "colgroup",null, columns);
    }

    static td( content , css){
        return this.element("td", null, content, css);
    }

    static tbody( rows ){
        return this.element("tbody", null, rows);
    }

    static tr( cells ){
        return this.element( "tr", null, cells );
    }

    static table( attr, columns, tbody ){
        return this.element("table",attr, [columns, tbody] );
    }
}
