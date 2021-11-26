import { toolbox_group, toolbox_controller  } from "./toolbox.js";
import { object_type  } from "./metamodel.js";
import { SVG  } from "./svg.js";


export class c4_object_types
{
    static person_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAACnSURBVEhL3ZXBDYAgDEWRlVzAqxN7dQFXQm2oCdQiDa2S+C5Wo/35/aQO+4lTEkLAKuK9xyqS3zVCm1JMRGqoRGBMdFQc4kymecMqsi4jVpFUrCkTKgDQZ9C4lE3VCSeQQh1xPDqpCQCSd1TBS+kvIpm3OhMr2NMlCZOj5OrmpFUAKH2biWgELrgeXrp/NPQ/wlacO6282Kww+f3W+FEmeH2VD0ScOwAFcT0iAi6fVgAAAABJRU5ErkJggg==";

    static person_shape_script( obj )
    {
        return SVG.group( {transform : `translate(${obj.x},${obj.y})`  },
            [ 
                SVG.rect({x: 0, y : 0, width : "150", height : "150", stroke : "black", "stroke-width": "1", fill : "white" }),
                SVG.rect({x: 0, y : 60, width : "150", height : "90", stroke : "darkblue", "stroke-width": "1", fill : "blue", rx : 20 }),
                SVG.circle({cx: 75, cy : 35, r : 35,stroke : "black", "stroke-width": "1", fill : "blue", rx : 20 })
            ]
         )
    }

    static person = new object_type('Person', c4_object_types.person_img, c4_object_types.person_shape_script);
}


export class c4model{
    static person_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAACnSURBVEhL3ZXBDYAgDEWRlVzAqxN7dQFXQm2oCdQiDa2S+C5Wo/35/aQO+4lTEkLAKuK9xyqS3zVCm1JMRGqoRGBMdFQc4kymecMqsi4jVpFUrCkTKgDQZ9C4lE3VCSeQQh1xPDqpCQCSd1TBS+kvIpm3OhMr2NMlCZOj5OrmpFUAKH2biWgELrgeXrp/NPQ/wlacO6282Kww+f3W+FEmeH2VD0ScOwAFcT0iAi6fVgAAAABJRU5ErkJggg==";
    static container_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAACzSURBVEhLY/wPBAwUgn///kFZEMDExARlQQAqj0yAbig6gPvEwfMsWIBa4MB2YyiLSj4hBDB8guwCcgA2c4ZxcIGAg/lmKIs0cOCkL5RFwCcGmsegLNIBLr0Ylly4bgVlkQ5w6aVunDBCaTRAXUtwFFB0SV2YluDwMiUA0xIcXqYEMIGKafSimtqA8e/fv2C3O3mfBwtQC9C9WAHWN0wEKx1KAVWqX0JggPIJDcBwsYSBAQB9RkIU1/MgpAAAAABJRU5ErkJggg==";
    static system_img = "data:image;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB+SURBVEhLY/z//z8DieDfv39QFgMDExMTlAVkQ2lSALJ+ZAB1l4PnWQifDHBguzGEQY67cAEUd8FtIBKg6RqsfqRZeAFBS/V3CIMgqGnlhDBoH4/kAbq4a1iGF7AAQS5DKAGDNd0DyzUQgPIoA9CwpwoYtOEFpakBqGcWAwMADvpCE+aMTt8AAAAASUVORK5CYII="; 
    static boundary_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAABXSURBVEhLY/wPBAw0BkxQmqYAwxJGRkYwhgFK+SCAElwgSWqFHrJZdAmuYRrx6BFGCUA2azROSAKjcUISGI0TksDARDzMmzBhSvkgMExTF63AcLGEgQEANN4xPu7ofY8AAAAASUVORK5CYII=";


    static toolbox_groups =  [
        new toolbox_group('C4 Model Entity', [
            c4_object_types.person
            ]
        )
    ];
}


