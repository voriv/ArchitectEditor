
import { SVG } from "../tools/svg.js";

export class canvas_view{
    model;
    svg;
    handlers;
    selection_shapes;
    object_shapes = [];

    constructor(model, handlers ){
        this.model = model;
        this.handlers = handlers;
        this.svg = this.initSVG();

        this.svg.onmouseup = e=>{
            if( handlers.onmouseup ){
                handlers.onmouseup( e );
            }
        }
        this.model.add_event_handler("object_changed", e=>{ this.redraw() })
    }

    clear_selection(){
        if( this.selection_shapes ){
            this.svg.removeChild( this.selection_shapes );
        }
        
        this.selection_shapes = null;
    }
    start_x;
    start_y;
    moving_shape;
    start_move(x,y,obj){

        this.start_x = x;
        this.start_y = y;
        try {

            this.moving_shape = SVG.rect({x: obj.x - 5, y :obj.y - 5, width : obj.w + 10, height : obj.h + 10, 
                stroke : "blue", "stroke-width": "5", "fill-opacity" : 0.1}); 
                this.svg.appendChild( this.moving_shape);
            
            this.svg.onmousemove = e=>{
                const dx = e.offsetX - this.start_x;
                const dy = e.offsetY - this.start_y;

                this.moving_shape.setAttribute("x", obj.x + dx - 5);
                this.moving_shape.setAttribute("y", obj.y + dy - 5);
            }

            this.moving_shape.onmouseup = e=>{
                this.svg.removeChild( this.moving_shape );
                this.moving_shape = null;
                if( this.handlers.onobjectmoved){
                    this.handlers.onobjectmoved( obj,e.offsetX - this.start_x, e.offsetY - this.start_y );
                }
            }
                
        } catch (error) {
            alert( error.message )
        }
    }

    select_object(obj){

        this.clear_selection();
        
        this.selection_shapes = SVG.rect({x: obj.x - 5, y :obj.y - 5, width : obj.w + 10, height : obj.h + 10, 
            stroke : "green", "stroke-width": "5", "fill-opacity" : 0.1}); 

            this.svg.appendChild( this.selection_shapes );
        
        this.selection_shapes.onmousedown = e=>{
            this.start_move(e.offsetX, e.offsetY, obj);
        }
    }

    add_object_shape( obj ){
        let obj_shape = obj.formatSVG();
        obj_shape.onmousedown = e=>{
            if( this.handlers.onselectobject){
                this.handlers.onselectobject( obj );
            } //this.select_object( obj );
        }

        this.svg.appendChild( obj_shape );
    }

    redraw(){
        this.clear_selection();

        for( let c of this.svg.children ){
            this.svg.removeChild( c );
        }

        this.model.active_diagram.objects.forEach(obj => {
            this.add_object_shape( obj );
        });
    }

    initSVG(){
        return SVG.svg( "100%", "100%", null, null,{ "background-color" : "lightgray" });
    }

    set_cursor( cursor ){
        this.svg.style.cursor = cursor;
    }
    clear_cursor(){
        this.svg.style.cursor = null;
    }
}