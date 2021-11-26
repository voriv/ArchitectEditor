import { toolbox_group, toolbox_controller  } from "./toolbox.js";
import { object_type  } from "./metamodel.js";
import { SVG  } from "./svg.js";


export class svg_object_type
{
    static rect_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAABKSURBVEhL7dUxDgAQEETRHfe/MwqSFdWEnWpeg8YPCuhTFGtrLHWcBMCa/bG3viJp+STvJbkuRyiOUByhOEKRRPT/SRU/PEUQiRimUiAYHjxmGgAAAABJRU5ErkJggg==";

    static rect_shape( obj )
    {
        if( !obj.w )
        {
            obj.w =  150;
        }
        
        if( !obj.h ){ obj.h = 100;}

        return SVG.group( {transform : `translate(${obj.x},${obj.y})`  },
            [ 
                SVG.rect({x: 0, y : 0, width : obj.w, height : obj.h, stroke : "black", "stroke-width": "1", fill : "white" }),
            ]
         )
    }

    static set_default_rect( e ){
        e.svg_attributes = { stroke : "black", "stroke-width": "1", fill : "white" };
    }

    static rect = new object_type('rect', svg_object_type.rect_icon, svg_object_type.rect_shape, svg_object_type.set_default_rect);
}


export class svg_model{

    static toolbox_groups =  [
        new toolbox_group('SVG Figures', [
            svg_object_type.rect
            ]
        )
    ];
}


