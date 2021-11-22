//import { log_console } from "./log";
class log_console{
    static attach( html_element )
    {
        this.html_element = html_element;
        this.html_element.onclick = e=>{ alert(this.log_buffer ) }
    }
    static html_element;
    static log_buffer = '';
    static log( e )
    {
        if( typeof e == "string" ){
            this.log_buffer = this.log_buffer + e + '\r\n'; 
        } else{
               log_console.log_buffer = log_console.log_buffer + JSON.stringify( e) + "\r\n";
        }
    }

}

//var log_console;
const svgNS = "http://www.w3.org/2000/svg";

class toolbox_element{
    constructor( name )
    {
        this.text = name;
    }
    text;
    cursor = 'url(cursor/add_element.cur) 2 2, auto';
    image;
    format_toolbox_item( canvas )
    {
        try{
            let div = document.createElement("div");
            div.className = 'toolboxitem';
            div.innerHTML = `<p name="class">${this.text}</p>`;
            div.onclick = (e) =>
            {
                try{
                    canvas.toolbox_selected( this )

                } catch( ex )
                {
                    alert( ex.message )
                }
            } 
            return div;
        }catch( ex )
        {
            alert( ex.message);
        }

    }
    click()
    {
        canvas_div.style.cursor = this.cursor;
    }

    format_svg( x, y)
    {
        return  SVGTool.createSVGElement( "g" , null, `<rect x="${x}" y="${y}" fill="white" stroke="black" width="150" height="120"/>`);
    }

    format_object( x, y, container)
    {
        let element = { name : this.text, type : this.text };
        let obj = new diagram_object( element, x,y, this, container);
         obj.w = 150;
        obj.h = 120;
        return obj;
    }
    
}

class SVGTool
{
    static createSVGElement( name , attr, innerHTML )
    {
        var e = document.createElementNS(svgNS, name );
        if( attr ){
            for( let a in attr){
                e.setAttribute( a, attr[a]);
            }
        }
        if( innerHTML ) e.innerHTML = innerHTML; 
        return e;
    }
}

class diagram_object
{
    constructor( element, x, y, template, container)
    {
        this.element = element;
        //this.shape.diagram_object = this;
        this.template = template;
        this.x = x;
        this.y = y;
        this.container= container;
    }
    container;
    template
    element;
    shape;
    x;
    y;
    selection_shape;
    active_shape;

    format_shape()
    {
        if( this.shape )
        {
            this.shape.parentElement.removeChild( this.shape );
        }

        this.shape = this.template.format_svg(this.x, this.y);
        this.container.appendChild( this.shape);
        return this.shape;
    }
    format_selection_shape()
    {
        this.clear_selection();
        
        this.selection_shape = SVGTool.createSVGElement( "rect", {
            x : this.x - 5, y : this.y -5, width : this.w + 10, height : this.h + 10,
            stroke : "red", "stroke-width" : 5, "fill-opacity" : 0.1
        }, "" );

        this.container.appendChild(this.selection_shape );
        return this.selection_shape;

    }

    clear_selection() {
        if (this.selection_shape) {
            this.selection_shape.parentElement.removeChild(this.selection_shape);
            this.selection_shape = null;
        }

        if (this.active_shape) {
            this.active_shape.parentElement.removeChild(this.active_shape);
            this.active_shape = null;
        }
    }

    format_active_shape()
    {
        this.clear_selection();
        
        this.active_shape = SVGTool.createSVGElement( "rect", {
            x : this.x - 5, y : this.y -5, width : this.w + 10, height : this.h + 10,
            stroke : "green", "stroke-width" : 5, "fill-opacity" : 0.1
        }, "" );

        this.container.appendChild(this.active_shape );
        return this.active_shape;
    }

    move(cx,cy)
    {
        if( cx ==0 && cy == 0 )
        return;
        this.x += cx;
        this.y += cy;
         
        this.format_shape();

        if( this.selection_shape ){
            this.format_selection_shape();
        }

        if( this.active_shape ){
            this.format_active_shape();
        }
    }
}


var toolbox_items = [
    new toolbox_element('Class')
];

class canvas_controller{
    constructor( canvas_svg )
    {
        this.svg_container =  canvas_svg;
        this.svg_container.onmousedown = (e) =>{ 
            this.mouse_down(e);
        }
    }

    objects = [];
    selected_objects = [];
    active_obect;
    svg_container;
    //selection_svg_objects = [];
    set_cursor( cursor )
    {
        this.svg_container.parentElement.style.cursor = cursor;
    }

    clear_selection()
    {
        if( this.selected_objects)
        {

            this.selected_objects.forEach( obj =>{
                obj.clear_selection();
            })
        }
        this.selected_objects = [];
        this.active_obect = null;
    }

    activate( obj )
    {
        if( this.active_obect )
        {
            this.active_obect.format_selection_shape();
            this.set_handlers(this.active_obect);
        }
        obj.format_active_shape();
        this.active_obect = obj;
        this.set_handlers(obj);
    }
    select_object( obj )
    {
        this.clear_selection();
        this.selected_objects = [obj];
        this.activate(obj);
    }

    add_selection( obj )
    {
        if( this.selected_objects.lenght == 0 )
        {
            return this.select_object( obj );
        }
        
        const index = this.selected_objects.indexOf( obj );
        if( index > -1 )
        {
            obj.clear_selection();
            this.selected_objects.splice( index, 1);
            if( this.active_obect == obj )
            {
                if( this.selected_objects.length > 0 )
                {
                    this.activate( this.selected_objects[0] );
                } else{
                    this.active_obect = null;
                }
                return;
            }
            this.set_handlers(obj);
            return;
        }
        //this.active_obect.format_selection_shape();
        this.selected_objects.push( obj );
        this.activate(obj);
    }
    

    mouse_down(mouse_event)
    {
        try{

            this.clear_selection();
        } catch( ex )
        {
            alert( ex.message + ex.stack )
        }
    }

    start_move( start_e, main_obj )
    {
        const start_x =  start_e.offsetX;
        const start_y =  start_e.offsetY;
        let moving_group = SVGTool.createSVGElement( "g", null );
        this.svg_container.appendChild( moving_group );
        this.selected_objects.forEach( obj =>{
            let moving_shape = SVGTool.createSVGElement( "rect", {
                x : obj.x - 5 , y : obj.y - 5, width : obj.w +10, height : obj.h + 10,
                stroke: "blue", "stroke-width" : 5, "fill-opacity" : 0.1
            } );
            obj.moving_shape = moving_shape;
            moving_group.appendChild( moving_shape );
        });

        moving_group.onmousemove = e=>
        {
            const cx = e.offsetX - start_x;
            const cy = e.offsetY - start_y;
            this.selected_objects.forEach( obj =>{
                if( obj.moving_shape ){
                    obj.moving_shape.setAttribute('x', obj.x + cx - 5 );
                    obj.moving_shape.setAttribute('y', obj.y + cy - 5 );
                }
            });
        }
        moving_group.onmouseup =e=>{
            const cx = e.offsetX - start_x;
            const cy = e.offsetY - start_y;

            moving_group.parentElement.removeChild( moving_group );
            
            this.selected_objects.forEach( obj =>{
                obj.move( cx, cy );

                this.set_handlers( obj );
                e.stopPropagation();

            })
        }
    }

    set_handlers( obj )
    {
        obj.shape.onmousedown = (e) =>
        {
            try{
                if( e.shiftKey || e.ctrlKey )
                {
                    this.add_selection( obj );
                    e.stopPropagation();
                    return false;
                }
                this.select_object( obj );
                this.start_move( e, obj);
                e.stopPropagation();
                return false;
            } catch (er)
            {
                log_console.log( er );
            }
        };

        if( obj.selection_shape ){
            obj.selection_shape.onmousedown = (e) =>{
                if( e.shiftKey || e.ctrlKey )
                {
                    this.add_selection( obj );
                    e.stopPropagation();
                    return false;
                }

                this.start_move(e, obj);
                e.stopPropagation();
            }
        }

        if( obj.active_shape )
        {
            obj.active_shape.onmousedown = (e) =>{
                if( e.shiftKey || e.ctrlKey )
                {
                    this.add_selection( obj );
                    e.stopPropagation();
                    return false;
                }
                this.start_move(e, obj);
                e.stopPropagation();
            }
        }
    }
    toolbox_selected( item )
    {
        this.svg_container.parentElement.style.cursor = item.cursor;
        this.svg_container.onmousedown = (e) => {
            try{
                this.svg_container.parentElement.style.cursor = '';
                
                let obj = item.format_object(e.offsetX, e.offsetY, this.svg_container);
                obj.format_shape();
                this.set_handlers( obj );
                this.objects.push( obj );
                this.svg_container.onmousedown = ee=>this.clear_selection();
           
                this.select_object( obj );
                this.start_move( e, obj );
            }
            catch( ex )
            {
                alert( ex.message + ex.stack );
            }
        }
    }
  
}

var canvas_model;
var canvas_div;
var toolbox;

function load()
{
    try{
       prepare_log();
       canvas_model = new canvas_controller( document.getElementById('target_canvas'));
       canvas_div = document.getElementById("canvas");
       toolbox = document.getElementById('toolbox');

       toolbox_items.forEach( (item) =>{
           toolbox.appendChild( item.format_toolbox_item( canvas_model ))
       } )
    }catch( ex )
    {
        alert(ex.message);
    }

    function prepare_log() {
        log_console.attach( document.getElementById('console') );
    }
}