import { toolbox_view } from "../views/toolbox_view.js";

export class toolbox_controller{
    static add_element_cursor = "url(data:application/cur;base64,AAACAAEAICAAAAAAAAAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAH/AAAB7wAAAe8AAAHvAAABAQAAAe8AADHvAAAx7wAAYf8AAGAAAADAAAAQwAAAGYAAAB2AAAAfgAAAH/AAAB/gAAAfwAAAH4AAAB8AAAAeAAABXUAAApqAAAFVQAACioAAAVVAAAP/4AAAAAAAAAAAAA/////////////8AH///AB///wAf//8AH///AB///wAf//EAH//hAB//4QAf/8MAH/fDAB/zh///8Yf///AP///wD///8AD///AB///wA///8Af///AP//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD///////8=), auto";

    model;
    view;
    constructor(model, parent ){
        this.model = model;
        this.view = new toolbox_view( model,
            {
                on_click_item : e=>{ this.start_add_type(e)},
                on_mouseup : e=>{ this.cancel_add() }
            } );
        this.attach( parent);
    }
    attach( parent ){
       // alert( this.view.div.outerHTML);
        parent.appendChild( this.view.div );
    }
    start_add_type( type ){
        this.view.set_cursor( toolbox_controller.add_element_cursor);
    }
    cancel_add()
    {
        this.view.clear_cursor();
    }
}

