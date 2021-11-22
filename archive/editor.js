const svgNS = "http://www.w3.org/2000/svg";

class selection_state
{
    canvas;
    selected_item;
    constructor ( svg )
    {
        this.canvas = svg;
    }

    move( item, cx,cy )
    {
        item.setAttribute( "x", parseInt( item.getAttribute("x")) + cx  );
        item.setAttribute( "y", parseInt( item.getAttribute("y")) + cy );
    }

    start_move(e)
    {
        try{
            const start_x =e .offsetX;
            const start_y = e.offsetY;
            if( !this.selected_item ){
                return;
            }

            var moving_boxes = Array.from( this.selected_item,  ( iss ) =>
            {
                var mb = createSVGElement( "rect", {
                    x: iss.getAttribute( "x") - 5,
                    y: iss.getAttribute( "y") - 5,
                    width: 10 + parseInt( iss.getAttribute( "width") ),
                    height: 10 + parseInt( iss.getAttribute( "height") ),
                    stroke : "red",
                    "fill-opacity" : 0.1,
                    "stroke-width" : 5,
                });

                mb.start_x =  iss.getAttribute( "x") - 5;
                mb.start_y =  iss.getAttribute( "y") - 5;
                mb.selection_box = iss;

                this.canvas.appendChild( mb );

                mb.onmousemove = (ee) =>
                {
                    moving_boxes.forEach( (mi) =>{
                        try{
                            mi.setAttribute("x", mi.start_x + ee.offsetX - start_x);
                            mi.setAttribute("y", mi.start_y + ee.offsetY - start_y);
                        }catch( ex )
                        {
                            alert( ex.message )
                        }
                    
                    });
                    e.stopPropagation();
                }

                mb.onmouseup = (ee)=>{
                    const cx = ee.offsetX - start_x;
                    const cy = ee.offsetY - start_y;

                    moving_boxes.forEach((mi)=>{
                        mi.parentElement.removeChild( mi );
                        
                        this.move( mi.selection_box, cx, cy );
                        this.move( mi.selection_box.item, cx, cy );
                    })
                    ee.stopPropagation();
                }

                return mb;
            } );


        e.stopPropagation();
        }catch( ex )
        {
            alert ( ex.message + ex.stack )
        }
    }
    create_selection_rect( item )
    {
        let selection_box = createSVGElement( "rect", {
            x: item.getAttribute( "x") - 5,
            y: item.getAttribute( "y") - 5,
            width: 10 + parseInt( item.getAttribute( "width") ),
            height: 10 + parseInt( item.getAttribute( "height") ),
            stroke : "gray",
            "fill-opacity" : 0.1,
            "stroke-width" : 5
         });

        selection_box.item = item;

        selection_box.onmousedown = (e) => {
            if( e.ctrlKey ){
                const index = this.selected_item.indexOf( selection_box )
                if( index > -1 )
                {
                    selection_box.parentElement.removeChild( selection_box );
                    this.selected_item.splice( index, 1 );
                }
                return;
            }
            this.start_move(e);
            e.stopPropagation();
        }
        //moving_boxes

        //selection_box.onmousedown = this.start_move;

        this.canvas.appendChild( selection_box );
        return selection_box;
    }

    select( item )
    {
        this.clear_selection();
        this.selected_item = [this.create_selection_rect(item)];
    }

    add(item)
    {
        try{
            if( !this.selected_item )
            {
                this.selected_item = [];
            }

            this.selected_item.push(this.create_selection_rect(item));
            return true;

        }catch( ex )
        {
            alert(ex.message);
        }
    }

    clear_selection()
    {
        //alert ('clear selection');
        if( this.selected_item )
        {
            this.selected_item.forEach( (item) => {
                item.parentElement.removeChild( item);
            });
            this.selected_item = null;
        }
    }

    has_selection()
    {
        if( selected_item )
            return true;
        return false;
    }
}

function click_svg(e)
{
    try{
        let canvas1 = document.getElementById("target_canvas");
        selection.clear_selection();
    }catch( ex )
    {
        alert( ex.message + ex.stack )
    }
}

function createSVGElement( name, attr)
{
    var e = document.createElementNS(svgNS, name );
    for( a in attr)
    {
        e.setAttribute( a, attr[a]);
    }
    return e;
}

var selection;


const toolbox_items = [
    { 
        name: "Class",
        click : (ee)=>{ 
            let canvas1 = document.getElementById("target_canvas");
            canvas1.style.cursor = 'url(cursor.cur), auto';

            canvas1.onclick = (e) => {
                canvas1.onclick = click_svg;
                canvas1.style.cursor = null;


                let canvas = document.getElementById("target_canvas");
                let rect = document.createElementNS(svgNS, "rect");
                rect.setAttribute("fill", "white");
                rect.setAttribute("x", e.offsetX - 150);
                rect.setAttribute("y", e.offsetY);
                rect.setAttribute("width", 300);
                rect.setAttribute("stroke", "black");
                rect.setAttribute("height", 100);


                rect.onmousedown = (e)=>{
                    try{
                        if( e.ctrlKey )
                        {
                            if( selection.add( rect ) )
                                selection.start_move(e);
                        } else{
                            selection.select(rect);
                            selection.start_move(e);
                        }
                        e.stopPropagation();
                    } catch( ex )
                    {
                        alert(ex.message + ' at ' + ex.stack);
                    }
                }
                selection.select( rect );
                canvas.appendChild( rect );
            }
        }
    }
];

function addItem(box, item )
{
    var item_div = document.createElement('div');
    item_div.innerHTML = `<p>${item.name}</p`;
    item_div.className = "toolboxitem";
    item_div.onclick = item.click;
    box.appendChild( item_div );
}

function load()
{
    try{
        var item_box = document.getElementById('toolbox_workspace');
        //
        selection = new selection_state( document.getElementById( 'target_canvas' ));

        toolbox_items.forEach( e => addItem( item_box, e));
    } catch( ex )
    {
        alert(ex.stack);
    }
}

function svg_mouse_select_move(e)
{
}

function svg_mouse_down(e)
{
    let svg = document.getElementById("target_canvas");
    var selection_box = createSVGElement( "rect", { x : e.offsetX, y: e.offsetY
        , "fill-opacity" : 0.1
        ,"stroke" : "black" });
    var x =  e.offsetX;
    var y = e.offsetY;
    svg.appendChild( selection_box );
    svg.onmousemove = (e) => {
        if( e.offsetX > x )
        {
            selection_box.setAttribute( "width", e.offsetX - x );
            selection_box.setAttribute( "x", x );
        } else{
            selection_box.setAttribute( "width",  x -  e.offsetX );
            selection_box.setAttribute( "x", e.offsetX );              
        }

        if( e.offsetY > y )
        {
            selection_box.setAttribute( "height", e.offsetY - y );
            selection_box.setAttribute( "y", y );

        } else{
            selection_box.setAttribute( "height", y - e.offsetY  );
            selection_box.setAttribute( "y", e.offsetY );
        }
    }

    svg.onmouseup = (e) =>{
        svg.removeChild( selection_box );
        svg.onmousemove = null;
        svg.onmouseup = null;
    }
}