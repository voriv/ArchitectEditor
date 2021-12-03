

import { object_type , model_techology } from "../model/editormodel.js";
import { SVG  } from "../tools/svg.js";


export class svg_object_types
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
         );
    }

    

    static set_default_rect( e ){
        e.svg_attributes = { stroke : "black", "stroke-width": "1", fill : "white" };
    }

    static rect = new object_type('rect', svg_object_types.rect_icon, svg_object_types.rect_shape, svg_object_types.set_default_rect);

    static types = [svg_object_types.rect];

}

export class svg_model{
    static technology = new model_techology("SVG Element", svg_object_types.types);
}




