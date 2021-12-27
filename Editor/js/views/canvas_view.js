
import { SVG } from "../tools/svg.js";

export class canvas_view {
    model;
    svg;
    handlers;
    selection_shapes = [];
    object_shapes = [];
    focused_object;
    selected_objects = [];

    constructor(model, handlers) {
        this.model = model;
        this.handlers = handlers;
        this.svg = this.initSVG();

        this.svg.onmouseup = e => {
            if (handlers.onmouseup) {
                handlers.onmouseup(e);
            }
        }
        this.svg.onmousedown = e=>{
            this.clear_selection();
        };
        this.model.add_event_handler("object_changed", e => { this.redraw() })
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
                const dx = e.offsetX - this.start_x;
                const dy = e.offsetY - this.start_y;

                this.moving_shape.setAttribute("x", obj.x + dx - 5);
                this.moving_shape.setAttribute("y", obj.y + dy - 5);
            }

            this.moving_shape.onmouseup = e => {
                this.svg.removeChild(this.moving_shape);
                this.moving_shape = null;

                if (this.handlers.onobjectmoved) {
                    this.handlers.onobjectmoved(obj, e.offsetX - this.start_x, e.offsetY - this.start_y);
                }
            }

        } catch (error) {
            alert(error.message)
        }
    }

    selectionSVG(obj) {
        let ret = SVG.group({}, [
            SVG.rect({
                x: obj.x - 5, y: obj.y - 5, width: obj.w + 10, height: obj.h + 10,
                stroke: "black", "stroke-width": "1", "fill-opacity": 0.1}),
            SVG.rect({
                x: obj.x - 10, y: obj.y - 10, width:  10, height: 10,
                stroke: "green", "stroke-width": "1", "fill": "black"} ),
            SVG.rect({
                x: obj.x + obj.w, y: obj.y +  obj.h , width:  10, height: 10,
                stroke: "green", "stroke-width": "1", "fill": "black"} ),
            SVG.rect({
                x: obj.x + obj.w, y: obj.y - 10 , width:  10, height: 10,
                stroke: "green", "stroke-width": "1", "fill": "black"} ),
            SVG.rect({
                x: obj.x -10, y: obj.y +  obj.h , width:  10, height: 10,
                stroke: "green", "stroke-width": "1", "fill": "black"} ),
            SVG.rect({
                x: obj.x + obj.w/2 - 5, y: obj.y - 10 , width:  10, height: 10,
                stroke: "green", "stroke-width": "1", "fill": "black"} ),
            SVG.rect({
                x: obj.x + obj.w/2 - 5, y: obj.y  +  obj.h , width:  10, height: 10,
                stroke: "green", "stroke-width": "1", "fill": "black"} ),
            SVG.rect({
                x: obj.x -10 , y: obj.y  +  obj.h/2 -5 , width:  10, height: 10,
                stroke: "green", "stroke-width": "1", "fill": "black"} ),
            SVG.rect({
                x: obj.x + obj.w , y: obj.y  +  obj.h/2 -5 , width:  10, height: 10,
                stroke: "green", "stroke-width": "1", "fill": "black"} )
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