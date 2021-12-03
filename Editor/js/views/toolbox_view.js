import { HTML } from "../tools/html.mjs";


class resources {
    static expanded_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAIAAADEEvsIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA6SURBVChTY/hLCPz//5/WilavXg1l4VIEVEFAEUQFEED5mIqg8mAAFUJTBJWEAagoHocjAyoq+v8fAFKQeUTkz0ABAAAAAElFTkSuQmCC"
    static collapsed_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB4SURBVChTpY/BCcAgDEW7/yqOoOAAestVN9ARiv2QtFSIou07BH94yM/RdhD7XOC37b3POUvoUWxjTAjBOVdrldWNbmOWUqy1MUZeMkObISIUkzC30R7f85sZ2uiA9rx50G2cmFKS/EKxURQnSuhR7Alf7UV27NYupQqNj0vAphMAAAAASUVORK5CYII="
}

export class toolbox_view {
    model;
    div;
    handlers;
    constructor(model, handlers) {
        this.model = model;
        this.formatHTML();
        this.handlers = handlers;
    }

    item_click( item ){

        if( this.handlers )
        {
            if( this.handlers.on_click_item ){
                this.handlers.on_click_item( item );
            }
        }
    }

    mouseup(){

        if( this.handlers )
        {
            if( this.handlers.on_mouseup ){

                this.handlers.on_mouseup();
            }
        }
    }
    group_name(name) {
        return HTML.div({ width: "auto", cursor: "pointer" },
            [
                HTML.img(resources.expanded_img, { display: "inline-block" }),
                HTML.div({ display: "inline-block" }, name)
            ]);
    }

    item(type) {
        let item =  HTML.div(
            { width: "auto" },
            [
                HTML.div({ width: 20, display: "inline-block" }),
                HTML.img(type.icon, {
                    verticalAlign: "middle",
                    display: "inline-block"
                }),
                HTML.div({ width: 20, display: "inline-block" }),
                HTML.div({ display: "inline-block" }, type.name)
            ]
        );
        item.onmousedown = e =>{
            try{
                 this.item_click( type );
            }catch( error ){
                alert( error.message )
            }
        }
        return item;
    }
    group(tech) {
        let items = tech.types.map(t => this.item(t));
        let name = this.group_name(tech.name)
        let div = HTML.div(
            {
                width: "100%"
            },
            [
                name,
                ...items
            ]
        );
        name.onclick = e=>{
            items.forEach( i  =>{
                i.hidden = !i.hidden;
            });
        }
        return div;
    }
    header() {
        return HTML.div({
            backgroundColor: "lightgray",
            width: "100%",
            border: "1px solid  gray",
            textAlign: "left",
        }, "Toolbox");
    }
    formatHTML() {
        this.div = HTML.div(
            {
                border: "1px solid gray",
                width: 200,
                height: "80%",
                top: 20,
                left: 10,
                float: "left",
                position: "absolute",
                boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                cursor: "default"
            }
            , [this.header(),
            ...this.model.technologies.map(t => this.group(t))]);
        this.div.onmouseup = (e) => {
            this.mouseup();
        }
    }


    set_cursor( cursor ){
        this.div.style.cursor = cursor;
    }
    clear_cursor( ){
        this.div.style.cursor = "";
    }
}