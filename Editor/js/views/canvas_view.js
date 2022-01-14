
import { SVG } from "../tools/svg.js";


class selection_shape {
    static corner_attributes = { stroke: "black", "stroke-width": "1", "fill": "black" };
    static focus_corner_attributes = { stroke: "black", "stroke-width": "1", "fill": "white" };

    static left_top(obj, attr, mousedown, scale) {
        let ret = SVG.rect(
            Object.assign({ x: obj.x - 10, y: obj.y - 10, width: 10, height: 10 }, attr));
            ret.onmousedown = mousedown;
            return ret;
    }
    static right_top(obj, attr, mousedown) {
        return SVG.rect(
            Object.assign({ x: obj.x + obj.w, y: obj.y - 10, width: 10, height: 10, onmousedown: mousedown }, attr)
        );
    }
    static right_bottom(obj, attr, mousedown) {
        return SVG.rect(Object.assign({ x: obj.x + obj.w, y: obj.y + obj.h, width: 10, height: 10, onmousedown: mousedown }, attr));
    }
    static left_bottom(obj, attr, mousedown) {
        return SVG.rect(Object.assign({ x: obj.x - 10, y: obj.y + obj.h, width: 10, height: 10, onmousedown: mousedown }, attr));
    }
    static top_center(obj, attr, mousedown) {
        return SVG.rect(Object.assign({ x: obj.x + obj.w / 2 - 5, y: obj.y - 10, width: 10, height: 10, onmousedown: mousedown }, attr));
    }
    static left_center(obj, attr, mousedown) {
        return SVG.rect(Object.assign({ x: obj.x - 10, y: obj.y + obj.h / 2 - 5, width: 10, height: 10, onmousedown: mousedown }, attr));
    }
    static right_center(obj, attr, mousedown) {
        return SVG.rect(Object.assign({ x: obj.x + obj.w, y: obj.y + obj.h / 2 - 5, width: 10, height: 10, onmousedown: mousedown }, attr));
    }
    static bottom_center(obj, attr, mousedown) {
        return SVG.rect(Object.assign({ x: obj.x + obj.w / 2 - 5, y: obj.y + obj.h, width: 10, height: 10, onmousedown: mousedown }, attr));
    }

    static resize_shape(obj, dx, dy, layout_func) {
        const l = layout_func(obj, dx, dy);
        return SVG.rect({
            x: l.x, y: l.y, width: l.w, height: l.h,
            stroke: "gray", "stroke-width": "5", "fill": "lightgray"
        });
    }

    static left_top_layout(obj, dx, dy) {
        return { x: obj.x + dx, y: obj.y + dy, w: obj.w - dx, h: obj.h - dy };
    }
    static left_bottom_layout(obj, dx, dy) {
        return { x: obj.x + dx, y: obj.y, w: obj.w - dx, h: obj.h + dy };
    }
    static right_top_layout(obj, dx, dy) {
        return { x: obj.x, y: obj.y + dy, w: obj.w + dx, h: obj.h - dy };
    }
    static right_bottom_layout(obj, dx, dy) {
        return { x: obj.x, y: obj.y, w: obj.w + dx, h: obj.h + dy };
    }
    static top_center_layout(obj, dx, dy) {
        return { x: obj.x, y: obj.y + dy, w: obj.w, h: obj.h - dy };
    }
    static bottom_center_layout(obj, dx, dy) {
        return { x: obj.x, y: obj.y, w: obj.w, h: obj.h + dy };
    }
    static left_center_layout(obj, dx, dy) {
        return { x: obj.x + dx, y: obj.y, w: obj.w - dx, h: obj.h };
    }
    static right_center_layout(obj, dx, dy) {
        return { x: obj.x, y: obj.y, w: obj.w + dx, h: obj.h };
    }

    static frame(obj, attr, mousedown, changesize_handlers) {
        let rect = SVG.rect({
            x: obj.x - 5, y: obj.y - 5, width: obj.w + 10, height: obj.h + 10,
            stroke: "black", "stroke-width": "1", "fill-opacity": 0.1
        });
        if (mousedown) {
            rect.onmousedown = e => {
                mousedown(e)
                e.stopPropagation();
            }
        }

        if( !changesize_handlers ){
            changesize_handlers = {};
        }

        let ret = SVG.group({}, [
            rect,
            this.left_top(obj, attr, changesize_handlers.left_top),
            this.top_center(obj, attr),
            this.right_top(obj, attr),
            this.right_center(obj, attr),
            this.right_bottom(obj, attr),
            this.bottom_center(obj, attr),
            this.left_bottom(obj, attr),
            this.left_center(obj, attr)
        ]);
        return ret;
    }

    static moving_style = { stroke: "black", "stroke-width": "1", "fill-opacity": 0.1, fill: "black" };
    static moving_frame(objs) {
        return SVG.group({},
            objs.map(
                o => SVG.rect(
                    Object.assign(
                        { x: o.x, y: o.y, width: o.w, height: o.h },
                        this.moving_style
                    )
                )
            )
        );
    }
}

class selection_state {
    focus;
    selection;
    svg;
    mousedown_handler;

    constructor(svg, mousedown) {
        this.svg = svg;
        this.mousedown_handler = mousedown;
    }
    change_scale(scale) {
    }

    redraw() {
        if (this.focus) {
            this.svg.removeChild(this.focus.frame);
            this.focus.frame = selection_shape.frame(this.focus.o, selection_shape.focus_corner_attributes,
                e => {
                    this.mousedown(e);
                }, this.change_size_handlers
            );
            this.svg.appendChild(this.focus.frame);
        }
        if (this.selection) {
            this.selection.forEach(
                selected => {
                    this.svg.removeChild(selected.frame);
                    selected.frame = selection_shape.frame( selected.o, selection_shape.corner_attributes,
                        e => {
                            this.mousedown(e);
                        }
                    );
                    this.svg.appendChild(selected.frame);
                }
            )
        }
    }

    clear() {
        if (this.focus) {
            this.svg.removeChild(this.focus.frame);
            this.focus = null;
        }

        if (this.selection) {
            this.selection.forEach(o => {
                this.svg.removeChild(o.frame);
            })
            this.selection = null;
        }
    }
    mousedown(e) {
        if (this.mousedown_handler) {
            this.mousedown_handler(e);
        }
    }
    select(obj) {
        this.clear();
        this.add_focus(obj);

    }
    change_size_handlers = {
        left_top : e=>{
            alert('left top');
        }
    }
    add_focus(obj) {
        this.focus = {
            o: obj, frame: selection_shape.frame(obj, selection_shape.focus_corner_attributes,
                e => {
                    this.mousedown(e);
                }, this.change_size_handlers)
        };
        this.svg.appendChild(this.focus.frame);
    }

    add(obj) {
        if (this.focus) {
            if (!this.selection) {
                this.selection = [];
            }
            this.svg.removeChild(this.focus.frame);
            const so = selection_shape.frame(this.focus.o, selection_shape.corner_attributes,
                e => {
                    this.mousedown(e);
                });
            this.svg.appendChild(so);
            this.selection.push({ o: this.focus.o, frame: so });
        }
        this.add_focus(obj);
    }

    moving_frame() {
        if (!this.selection) {
            return selection_shape.moving_frame([this.focus.o]);
        }
        let test = this.selection.map(s => {
            return s.o;
        });

        return selection_shape.moving_frame([this.focus.o, ...this.selection.map(s => {
            return s.o;
        })]);
    }

    get_objects() {
        if (!this.selection) {
            return [this.focus.o];
        }
        return [this.focus.o, ...this.selection.map(s => {
            return s.o;
        })];
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

    selection;

    constructor(model, handlers) {
        this.model = model;
        this.handlers = handlers;
        this.svg = this.initSVG();
        this.selection = new selection_state(this.svg, e => { this.selection_mousedown(e) });

        this.svg.onmouseup = e => this.default_mouseup(e);

        this.svg.onmousedown = e => {
            this.default_mousedown(e);
        };
        this.model.add_event_handler("object_changed", e => { this.redraw() })
    }

    selection_mousedown(e) {
        const start_x = e.offsetX;
        const start_y = e.offsetY;

        let moving_group = null;

        this.svg.onmousemove = me => {
            try {
                const dx = me.offsetX - start_x;
                const dy = me.offsetY - start_y;


                if (!moving_group) {

                    moving_group = this.selection.moving_frame();
                    this.svg.appendChild(moving_group)
                }
                moving_group.setAttribute("transform", `translate(${dx},${dy})`);
            } catch (error) {
                alert(error.message + error.stack);
            }
        }
        this.svg.onmouseup = ue => {
            try {
                const dx = ue.offsetX - start_x;
                const dy = ue.offsetY - start_y;

                if (moving_group) {
                    this.svg.removeChild(moving_group);

                    this.selection.get_objects().forEach(obj => {
                        this.object_layout_changed(obj, obj.x + dx, obj.y + dy, obj.w, obj.h);
                    })
                }
                this.svg.onmouseup = ee => this.default_mouseup(ee);
                this.svg.onmousemove = null;
            } catch (error2) {
                alert(error2.message)
            }

        }
        e.stopPropagation();
    }
    default_mousedown(e) {
        try {
            this.clear_selection();

            let selection_rect = null;
            const start_x = e.offsetX * this.scale / 100;
            const start_y = e.offsetY * this.scale / 100;

            this.svg.onmousemove = e => {
                try {
                    const dx = e.offsetX * this.scale / 100 - start_x;
                    const dy = e.offsetY * this.scale / 100 - start_y;

                    if (!selection_rect) {
                        selection_rect = SVG.rect({ x: start_x, y: start_y, width: dx, height: dy, stroke: "black", "stroke-width": "1", "fill-opacity": 0.1 });
                        this.svg.appendChild(selection_rect);
                    }

                    selection_rect.setAttribute("width", dx);
                    selection_rect.setAttribute("height", dy);
                } catch (error) {
                    alert(error.message)
                }
            }
            this.svg.onmouseup = e => {
                try {
                    const dx = e.offsetX * this.scale / 100 - start_x;
                    const dy = e.offsetY * this.scale / 100 - start_y;
                    if (selection_rect) {

                        this.svg.removeChild(selection_rect);

                        let objects_for_selection = this.model.active_diagram.objects.filter(i => {
                            return (start_x <= i.x) && (start_y <= i.y) && ((start_x + dx) >= (i.x + i.w)) && ((start_y + dx) >= (i.y + i.h));
                        });

                        objects_for_selection.forEach(i => {
                            this.add_to_selection(i)
                        });
                    }

                    this.svg.onmousemove = null;
                    this.svg.onmouseup = ee => {
                        this.default_mouseup(ee);

                    }
                } catch (error) {
                    alert(error.message)
                }
            }
        } catch (error) {
            alert(error.message + error.stack);
        }
    }

    scale = 100;
    set_scale(scale) {

        this.scale = scale;
        const w = this.svg.width.animVal.value * scale / 100;
        const h = this.svg.height.animVal.value * scale / 100;

        this.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    }


    default_mouseup(e) {
        if (this.handlers.onmouseup) {
            this.handlers.onmouseup(e);
        }
    }

    clear_selection() {
        this.selection.clear();
    }

    start_x;
    start_y;
    moving_shape;


    object_layout_changed(obj, x, y, w, h) {
        if (this.handlers.object_layout_changed) {
            this.handlers.object_layout_changed(obj, x, y, w, h);
        }
    }

    start_resize(e, layout_func) {
        let start_x = e.offsetX;
        let start_y = e.offsetY;
        let shapes = null;

        this.svg.onmousemove = e => {
            const dx = (e.offsetX - start_x) * this.scale / 100;
            const dy = (e.offsetY - start_y) * this.scale / 100;

            if (shapes) {
                shapes.forEach(s => {
                    this.svg.removeChild(s);
                })
                shapes = null;
            }
            shapes = this.selected_objects.map(obj => {
                let s = selection_shape.resize_shape(obj, dx, dy, layout_func);
                this.svg.appendChild(s);
                return s;
            });
        }

        this.svg.onmouseup = e => {
            const dx = (e.offsetX - start_x) * this.scale / 100;
            const dy = (e.offsetY - start_y) * this.scale / 100;

            this.svg.onmousemove = null;
            this.svg.onmouseup = e => this.default_mouseup(e);

            if (shapes) {
                shapes.forEach(s => {
                    this.svg.removeChild(s);
                })
            }
            this.selected_objects.forEach(obj => {
                const layout = layout_func(obj, dx, dy);
                this.object_layout_changed(obj, layout.x, layout.y, layout.w, layout.h);
            });
        }
        e.stopPropagation();
    }
    select_object(obj) {
        this.selection.select(obj);
    }

    add_to_selection(obj) {
        this.selection.add(obj);
    }

    add_object_shape(obj) {
        let obj_shape = obj.formatSVG();
        obj_shape.onmousedown = e => {
            try {
                this.select_object(obj);
                this.selection_mousedown(e);
            } catch (error) {
                alert(error.message);
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

        this.selection.redraw();
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