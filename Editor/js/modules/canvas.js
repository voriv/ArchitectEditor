import { SVG  } from "./svg.js";

export class diagram_canvas{
    canvas_svg;
    diagram;
    object_elements = [];

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

    start_x;
    start_y;

    moving_rect;

    on_object_moved;


    start_move( obj ){
        try {
            if( this. moving_rect){
                this.canvas_svg.removeChild( this.moving_rect );
                this. moving_rect = null;
            }

            this.moving_rect = SVG.rect({x: obj.x - 5, y :obj.y - 5, width : obj.w + 10, height : obj.h + 10, 
                stroke : "gray", "stroke-width": "5", "fill-opacity" : 0.1}); 
                this.canvas_svg.appendChild( this.moving_rect );   
                let x = obj.x - 5;
                let y = obj.y - 5;

            this.moving_rect.onmousemove = (e) =>{
                const dx = e.offsetX -  this.start_x;
                const dy = e.offsetY -  this.start_y;
                this.moving_rect.setAttribute( "x", x + dx );
                this.moving_rect.setAttribute( "y", y + dy );
                
            }
            this.moving_rect.onmouseup = (e) =>{
                this.canvas_svg.removeChild( this.moving_rect );
                this.moving_rect = null;
                const dx = e.offsetX -  this.start_x;
                const dy = e.offsetY -  this.start_y;

                obj.x = obj.x + dx;
                obj.y = obj.y + dy;
                this.selection_shape.onmousemove = null;

            }         
        } catch (error) {
            alert( error.message )
        }
    }

    create_diagram_object( obj ){
        let svg = obj.format_svg();
        svg.onmousedown = (e) => {
            this.clear_selection();
            this.select_object( obj );
            
            this.selection_shape.onmousemove = (e)=>{
                this.start_x  = e.offsetX;
                this.start_y  = e.offsetY;
                this.start_move( obj );
            }
        }

        svg.onmouseup = (e) =>{
            this.selection_shape.onmousemove = null;
        }

        svg.object = obj;
        this.object_elements.push( svg );
        this.canvas_svg.appendChild( svg );
        this.select_object( obj );
    }

    selection_shape;

    select_object( obj ){
        this.clear_selection();
        this.selection_shape = SVG.rect({x: obj.x - 5, y :obj.y - 5, width : obj.w + 10, height : obj.h + 10, 
            stroke : "green", "stroke-width": "5", "fill-opacity" : 0.1}); 

        this.canvas_svg.appendChild( this.selection_shape );
        if( this.object_selected ){
            this.object_selected( obj );
        }

        this.selection_shape.onmousedown = (e)=>{
            this.start_x  = e.offsetX;
            this.start_y  = e.offsetY;
            this.start_move( obj );
        }

        this.selection_shape.onmouseup = (e) =>{
            this.selection_shape.onmousemove = null;
        }
    }

    object_selected;

    clear_selection(){
        if( this.selection_shape ){
            this.canvas_svg.removeChild( this.selection_shape );
            this.selection_shape = null;
        }
    }
}



