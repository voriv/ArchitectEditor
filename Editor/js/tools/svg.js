const svgNS = "http://www.w3.org/2000/svg";

export class SVG {
    static element( name, attributes, content, css )
    {
        var e = document.createElementNS(svgNS, name );
        for( let a in attributes)
        {
            e.setAttribute( a, attributes[a]);
        }
        if( content){
            content.forEach( (ce) =>{
                 e.appendChild(ce);
            })
        }
        if( css ){
            for( const name in css ){
                e.style[ name ] = css[ name ];
            }
        }
     
        return e;
    }
    static svg(h,w, attributes, content, css ){
        if( !attributes){
            attributes = {};
        }
        return this.element( "svg", Object.assign( { width : w, height : h } , attributes) ,content, css);
    }
    static circle( attributes ){
        return this.element( "circle", attributes);
    }
    static ellipse( attributes ){
        return this.element( "ellipse", attributes);
    }
    static rect( attributes ){
        return this.element("rect", attributes);
    }
    static group( attributes, content )
    { 
        return this.element("g", attributes, content);
    }
}