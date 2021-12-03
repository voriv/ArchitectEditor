const svgNS = "http://www.w3.org/2000/svg";

export class SVG {
    static element( name, attributes, content )
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
     
        return e;
    }
    static circle( attributes ){
        return this.element( "circle", attributes);
    }
    static rect( attributes ){
        return this.element("rect", attributes);
    }
    static group( attributes, content )
    { 
        return this.element("g", attributes, content);
    }
}