import { toolbox_view } from "../views/toolbox_view.js";
import { canvas_view } from "../views/canvas_view.js";
import { property_view } from "../views/prop_view.js";
import { scale_view } from "../views/scale_view.js";


export class editor_controller{
    static add_element_cursor = "url(data:application/cur;base64,AAACAAEAICAAAAAAAAAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAH/AAAB7wAAAe8AAAHvAAABAQAAAe8AADHvAAAx7wAAYf8AAGAAAADAAAAQwAAAGYAAAB2AAAAfgAAAH/AAAB/gAAAfwAAAH4AAAB8AAAAeAAABXUAAApqAAAFVQAACioAAAVVAAAP/4AAAAAAAAAAAAA/////////////8AH///AB///wAf//8AH///AB///wAf//EAH//hAB//4QAf/8MAH/fDAB/zh///8Yf///AP///wD///8AD///AB///wA///8Af///AP//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD///////8=), auto";

    model;
    parent;
    toolbox_view;
    canvas_view;
    prop_view;
    scale_view;

    constructor( model, parent ){
        this.model = model;
        this.toolbox_view = new toolbox_view( model ,  {
            on_click_item : e=>{ this.start_add_type(e)},
            on_mouseup : e=>{ this.cancel_add() }
        } );

        this.canvas_view = new canvas_view(model, {
            onmouseup : e=> {
                if( this.selected_type ){
                    this.create_item( this.selected_type, e.offsetX, e.offsetY ); 
                }
            },
            onselectobject: e=>{
                this.focus_object(e);
            },
            object_layout_changed : ( obj, x,y,w,h)=>{
                obj.set_layout( x,y,w,h);
                this.canvas_view.redraw();
            },
            onobjectmoved : (o,dx,dy )=>{
                o.set_position( o.x + dx, o.y + dy);
                this.canvas_view.redraw();
            }});

        this.prop_view = new property_view( model );
        this.scale_view = new scale_view();
        this.scale_view.add_scale_changed_handler( scale=>{ 
            this.canvas_view.set_scale( scale);
            //alert(`new scale = ${scale}`)
        })

        this.attach( parent );
    }

    focus_object( obj ){
        try{
            this.prop_view.show_object(obj );
        }catch( error){
            alert( error.message );
        }
    }

    attach( parent ){
        // alert( this.view.div.outerHTML);
         parent.appendChild( this.toolbox_view.div );

         if( this.canvas_view.svg ){
            parent.appendChild( this.canvas_view.svg );
         }
         parent.appendChild( this.prop_view.div );
         if( this.scale_view ){
             parent.appendChild( this.scale_view.div);
         }
     }

    selected_type;
    start_add_type( type ){
        this.selected_type =  type;
        this.toolbox_view.set_cursor( editor_controller.add_element_cursor);
        this.canvas_view.set_cursor( editor_controller.add_element_cursor );
    }

    create_item( type,x,y )
    {
        try {
            if(this.model.active_diagram )
            {
                let obj = this.model.active_diagram.create_element( type.name, type, x,y);
                this.canvas_view.select_object( obj );
                this.prop_view.show_object(obj);
                //alert(`add ${type.name} to ${this.model.active_diagram.name}`)
            }
            this.cancel_add();            
        } catch (error) {
            alert( error.message + error.stack);
        }

    }

    cancel_add()
    {
        this.selected_type = null;
        this.toolbox_view.clear_cursor();
        this.canvas_view.clear_cursor();
    }
}

