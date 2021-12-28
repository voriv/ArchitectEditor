
import { SVG } from "../tools/svg.js";


class selection_shape{
     static left_top_corner(obj, mousedown ){
        let ret = SVG.rect({
            x: obj.x - 10, y: obj.y - 10, width:  10, height: 10,
            stroke: "black", "stroke-width": "1", "fill": "white"
        } );
        
        ret.onmousedown = mousedown

        return ret; 
     }
     static right_top_corner(obj, mousedown){
        let ret = SVG.rect({
            x: obj.x + obj.w, y: obj.y - 10, width:  10, height: 10,
            stroke: "black", "stroke-width": "1", "fill": "white"
        } );
        
        ret.onmousedown = mousedown

        return ret; 
     }
     static right_bottom_corner(obj, mousedown){
        let ret = SVG.rect({
            x: obj.x + obj.w, y: obj.y + obj.h, width:  10, height: 10,
            stroke: "black", "stroke-width": "1", "fill": "white"
        } );
        ret.onmousedown = mousedown

        return ret; 
     }
     static left_bottom_corner(obj, mousedown){
        let ret = SVG.rect({
            x: obj.x - 10, y: obj.y + obj.h, width:  10, height: 10,
            stroke: "black", "stroke-width": "1", "fill": "white"
        } );
        ret.onmousedown = mousedown

        return ret; 
     }
     static top_center(obj, mousedown){
        let ret = SVG.rect({
            x: obj.x + obj.w/2 - 5, y: obj.y - 10, width:  10, height: 10,
            stroke: "black", "stroke-width": "1", "fill": "white"
        } );
        ret.onmousedown = mousedown

        return ret; 
     }
     static left_center(obj, mousedown){
         let ret =  SVG.rect({
            x: obj.x - 10, y: obj.y + obj.h /2 - 5, width:  10, height: 10,
            stroke: "black", "stroke-width": "1", "fill": "white"
        } );

        ret.onmousedown = mousedown;

        return ret; 
     }
     static right_center(obj, mousedown){
        let ret =  SVG.rect({
           x: obj.x + obj.w, y: obj.y + obj.h /2 - 5, width:  10, height: 10,
           stroke: "black", "stroke-width": "1", "fill": "white"
       } );
       ret.onmousedown = mousedown;

       return ret; 
       
    }
    static bottom_center(obj, mousedown){
        let ret = SVG.rect({
            x: obj.x + obj.w/2 - 5, y: obj.y + obj.h, width:  10, height: 10,
            stroke: "black", "stroke-width": "1", "fill": "white"
        } );
        ret.onmousedown = mousedown;

        return ret; 
     }

     static resize_shape(obj, dx, dy, layout_func ){
        const l = layout_func( obj, dx,dy );
        return SVG.rect({
            x: l.x , y: l.y , width:  l.w, height: l.h,
            stroke: "gray", "stroke-width": "5", "fill": "lightgray"
        } );
     }

    static left_top_layout( obj, dx, dy ){
        return { x: obj.x + dx, y: obj.y + dy, w : obj.w - dx, h: obj.h - dy };
    }    
    static left_bottom_layout( obj, dx, dy ){
        return { x: obj.x + dx, y: obj.y, w : obj.w - dx, h: obj.h + dy };
    } 
    static right_top_layout( obj, dx, dy ){
        return { x: obj.x, y: obj.y + dy, w : obj.w + dx, h: obj.h - dy };
    } 
    static right_bottom_layout( obj, dx, dy ){
        return { x: obj.x, y: obj.y, w : obj.w + dx, h: obj.h + dy };
    } 
    static top_center_layout( obj, dx, dy ){
        return { x: obj.x, y: obj.y + dy, w : obj.w, h: obj.h - dy };
    } 
    static bottom_center_layout( obj, dx, dy ){
        return { x: obj.x, y: obj.y, w : obj.w, h: obj.h + dy };
    } 
    static left_center_layout( obj, dx, dy ){
        return { x: obj.x + dx, y: obj.y , w : obj.w - dx, h: obj.h };
    } 
    static right_center_layout( obj, dx, dy ){
        return { x: obj.x, y: obj.y, w : obj.w + dx , h: obj.h };
    }
}

export class canvas_view {
    model;
    svg;
    handlers;
    selection_shapes = [];
    object_shapes = [];
    focused_object;
    selected_objects = [];

    constructor( model, handlers) {
        this.model = model;
        this.handlers = handlers;
        this.svg = this.initSVG();

        this.svg.onmouseup = e=> this.default_mouseup(e);

        this.svg.onmousedown = e=>{
            this.clear_selection();
        };
        this.model.add_event_handler("object_changed", e => { this.redraw() })
    }

    scale = 100;
    set_scale( scale){
        //alert(  );
        this.scale =  scale;
        const w = this.svg.width.animVal.value * scale / 100;
        const h = this.svg.height.animVal.value * scale / 100;

        this.svg.setAttribute( "viewBox", `0 0 ${w} ${h}`);
    }
    default_mouseup(e){
        if (this.handlers.onmouseup) {
            this.handlers.onmouseup(e);
        }
    }

    clear_selection() {
        this.selection_shapes.forEach(s => {
            this.svg.removeChild(s);
        });

        this.selection_shapes = [];
    }

    start_x;
    start_y;
    moving_shape;

    start_move(x, y, obj) {

        this.start_x = x;
        this.start_y = y;
        try {

            this.moving_shape = this.movingSVG(obj);

            this.svg.appendChild(this.moving_shape);

            this.svg.onmousemove = e => {
                const dx = ( e.offsetX - this.start_x ) * this.scale / 100;
                const dy = ( e.offsetY - this.start_y ) * this.scale / 100;

                this.moving_shape.setAttribute("x", obj.x + dx - 5);
                this.moving_shape.setAttribute("y", obj.y + dy - 5);
            }

            this.moving_shape.onmouseup = e => {
                const dx = ( e.offsetX - this.start_x ) * this.scale / 100;
                const dy = ( e.offsetY - this.start_y ) * this.scale / 100;

                this.svg.removeChild(this.moving_shape);
                this.moving_shape = null;

                this.object_layout_changed( obj, obj.x + dx, obj.y + dy, obj.w, obj.h );
            }

        } catch (error) {
            alert(error.message)
        }
    }

    object_layout_changed( obj, x, y, w, h ){
        if( this.handlers.object_layout_changed){
            this.handlers.object_layout_changed( obj, x,y,w,h );
        }
    }

    start_resize(e, layout_func){
        let start_x = e.offsetX;
        let start_y = e.offsetY;
        let shapes = null;

        this.svg.onmousemove = e=>{
            const dx = ( e.offsetX - start_x ) * this.scale / 100;
            const dy = ( e.offsetY - start_y ) * this.scale / 100;

            //const dx = e.offsetX - start_x;
            //const dy = e.offsetY - start_y;

            if( shapes ){
                shapes.forEach( s=>{
                    this.svg.removeChild( s );
                })
                shapes = null;
            }
            shapes = this.selected_objects.map( obj =>{
                   let s = selection_shape.resize_shape( obj, dx, dy, layout_func );
                   this.svg.appendChild( s );
                   return s;
               });
        }

        this.svg.onmouseup = e=>{
            const dx = ( e.offsetX - start_x ) * this.scale / 100;
            const dy = ( e.offsetY - start_y ) * this.scale / 100;

            this.svg.onmousemove = null;
            this.svg.onmouseup = e=>this.default_mouseup(e);

            if( shapes ){
                shapes.forEach( s=>{
                    this.svg.removeChild( s);
                })
            }
            this.selected_objects.forEach( obj =>{
                const layout = layout_func( obj, dx, dy );
                this.object_layout_changed( obj, layout.x, layout.y, layout.w, layout.h );
            });
        }
        e.stopPropagation();
    }

    selectionSVG(obj) {
        let ret = SVG.group({}, [
            SVG.rect({
                x: obj.x - 5, y: obj.y - 5, width: obj.w + 10, height: obj.h + 10,
                stroke: "black", "stroke-width": "1", "fill-opacity": 0.1
            }),
            selection_shape.left_top_corner(obj, e=> this.start_resize(e, selection_shape.left_top_layout )),
            selection_shape.left_bottom_corner(obj, e=> this.start_resize(e, selection_shape.left_bottom_layout )),
            selection_shape.right_top_corner(obj, e=> this.start_resize(e, selection_shape.right_top_layout )),
            selection_shape.right_bottom_corner(obj, e=> this.start_resize(e, selection_shape.right_bottom_layout )),
            selection_shape.top_center(obj, e=> this.start_resize(e, selection_shape.top_center_layout )),
            selection_shape.left_center(obj, e=> this.start_resize(e, selection_shape.left_center_layout )),
            selection_shape.right_center(obj, e=> this.start_resize(e, selection_shape.right_center_layout )),
            selection_shape.bottom_center(obj, e=> this.start_resize(e, selection_shape.bottom_center_layout ))
        ]);

        ret.onmousedown = e => {
            this.start_move(e.offsetX, e.offsetY, obj);
            e.stopPropagation();
        }
        return ret;
    }

    movingSVG(obj) {
        return SVG.rect({
            x: obj.x - 5, y: obj.y - 5, width: obj.w + 10, height: obj.h + 10,
            stroke: "blue", "stroke-width": "5", "fill-opacity": 0.1
        });
    }

    select_object(obj) {

        this.clear_selection();

        this.selected_objects = [obj];
        let ss = this.selectionSVG(obj);
 
        this.selection_shapes = [ss];

        this.svg.appendChild(ss);
    }

    add_object_shape(obj) {
        let obj_shape = obj.formatSVG();

        obj_shape.onmousedown = e => {
            
            this.select_object( obj );

            this.selection_shapes.forEach( i=>{
                i.onmousemove = e=>{
                    this.start_move( e.offsetX, e.offsetY, obj );
                }

                i.onmouseup = e=>{
                   i.onmousemove = null;
                }
            })

            if (this.handlers.onselectobject) {
                this.handlers.onselectobject(obj);
            }

            obj_shape.onmouseup = e=>{
                obj_shape.onmouseup = null;
                obj_shape.onmousemove = null;
            }

            e.stopPropagation();
        }
        this.object_shapes.push(obj_shape);
        this.svg.appendChild(obj_shape);
    }


    redraw() {
        this.object_shapes.forEach(s => {
            this.svg.removeChild(s);
        });
        this.object_shapes = [];

        this.model.active_diagram.objects.forEach(obj => {
            this.add_object_shape(obj);
        });

        this.selection_shapes.forEach(s => {
            this.svg.removeChild(s);
        });
        this.selection_shapes = [];

        this.selected_objects.forEach(o => {
            let ss = this.selectionSVG(o);
            this.svg.appendChild(ss);
            this.selection_shapes.push(ss);
        });
    }

    initSVG() {
        return SVG.svg("100%", "100%", null, null, { "background-color": "lightgray" });
    }

    set_cursor(cursor) {
        this.svg.style.cursor = cursor;
    }
    clear_cursor() {
        this.svg.style.cursor = null;
    }
}