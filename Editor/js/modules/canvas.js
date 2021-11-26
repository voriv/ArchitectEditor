export class diagram_canvas{
    canvas_svg;
    diagram;
    constructor( svg, dg )
    {
        this.canvas_svg =  svg;
        this.diagram = dg;
        this.canvas_svg.onmouseup = (e) => {
            this.on_mouseup( e.offsetX, e.offsetY);
        }
    }
    draw( obj  ){
        try{
            if( obj.type && obj.type.shape_script )
            {
                let g = obj.type.shape_script( obj );
               // alert( g.outerHTML );
                this.canvas_svg.appendChild( g );
                //alert( this.canvas_svg.innerHTML );
            }
        }catch( err ){
            alert( err.message + err.stack );
        }

    }
    set_cursor( cursor )
    {
        this.canvas_svg.style.cursor = cursor;
    }
    on_mouseup(x,y){
       // alert( `click on ${x}, ${y}`)
    }

    create_diagram_object( obj ){
        const svg = obj.format_svg();
        //alert( svg.outerHTML );
        this.canvas_svg.appendChild( svg );
    }
}