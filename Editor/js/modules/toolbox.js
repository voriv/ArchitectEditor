export class toolbox_controller
{
    expanded_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAIAAADEEvsIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA6SURBVChTY/hLCPz//5/WilavXg1l4VIEVEFAEUQFEED5mIqg8mAAFUJTBJWEAagoHocjAyoq+v8fAFKQeUTkz0ABAAAAAElFTkSuQmCC"
    collapsed_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB4SURBVChTpY/BCcAgDEW7/yqOoOAAestVN9ARiv2QtFSIou07BH94yM/RdhD7XOC37b3POUvoUWxjTAjBOVdrldWNbmOWUqy1MUZeMkObISIUkzC30R7f85sZ2uiA9rx50G2cmFKS/EKxURQnSuhR7Alf7UV27NYupQqNj0vAphMAAAAASUVORK5CYII="
    div;
    on_item_click;
    on_cancel_selection;
    create_item_div( item)
    {
        let item_div = document.createElement('div');
        item_div.style.width = "auto"
        item_div.style.cursor = "";
       
        item_div.innerHTML = `<div style="display: inline-block; width: 20;"></div><img style="vertical-align: middle;" src="${item.image}"><div style="display:  inline-block;">${item.name}</div>`;
        //name_div.className = "toolbox_item";

        //add selection behavior
        item_div.onmouseover = (e) => { item_div.style.backgroundColor  = 'lightgray'; }
        item_div.onmouseout = (e) => { item_div.style.backgroundColor  = 'white'; }
        item_div.onmousedown = (e) => {
            this.select_item( item );
        }
        item_div.onmouseup = (e) =>{
            this.cancel_selection();
        }
        return item_div;
    }
    group_name_div_list = [];
    create_item_group_div( group )
    {
        let group_div = document.createElement("div");
        group_div.style.width = "100%";
        group_div.id = group.name;
        //div.className = "toolbox_group";
        let name_div = document.createElement('div');
        name_div.style.width = "auto";
        name_div.style.cursor = "pointer";
        this.group_name_div_list.push( name_div );

        //name_div.className = "toolbox_group_name";
        name_div.innerHTML = `<img style="vertical-align: middle;display: inline-block;" src=\"${this.expanded_img}"><div style="display: inline-block;">${group.name}</div>`;
        let group_img = name_div.firstElementChild;
        group_div.appendChild( name_div );
        let items = [];

        for( const i of group.items){
            let item_div = this.create_item_div( i );
            item_div.id = `${group.name}.${i.name}`;
            group_div.appendChild( item_div );
            items.push ( item_div );
        }
        group_div.collapsed = false;

        name_div.onclick = (e) =>{
            items.forEach( (item) =>{
                item.hidden = !group_div.collapsed;
            })
            group_div.collapsed = !group_div.collapsed;
            if(group_div.collapsed ){
                group_img.src = this.collapsed_img;
            } else{
                group_img.src = this.expanded_img;
            }
        };
        //alert( div.outerHTML );
        return group_div;
    }

    constructor( div, groups )
    {
        this.div = div;
        div.style.cursor = "default";
        div.style.userSelect = "none";
        for( const g of groups)
        {
            div.appendChild(this.create_item_group_div( g ));
        }
    }
    selected_item;
    static add_element_cursor = "url(data:application/cur;base64,AAACAAEAICAAAAAAAAAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAH/AAAB7wAAAe8AAAHvAAABAQAAAe8AADHvAAAx7wAAYf8AAGAAAADAAAAQwAAAGYAAAB2AAAAfgAAAH/AAAB/gAAAfwAAAH4AAAB8AAAAeAAABXUAAApqAAAFVQAACioAAAVVAAAP/4AAAAAAAAAAAAA/////////////8AH///AB///wAf//8AH///AB///wAf//EAH//hAB//4QAf/8MAH/fDAB/zh///8Yf///AP///wD///8AD///AB///wA///8Af///AP//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD///////8=), auto";

    select_item( item )
    {

        try{
            this.selected_item = item;
            this.div.style.cursor = toolbox_controller.add_element_cursor;
            this.group_name_div_list.forEach( (d)=>{
                d.style.cursor = toolbox_controller.add_element_cursor
            });
            if( this.on_item_click )
            {
                this.on_item_click( item );
            }
        }catch(err )
        {
            alert( err.message);
        }
    }
    cancel_selection()
    {

        try{
    
            this.div.style.cursor = "default";
            this.group_name_div_list.forEach( (d)=>{
                d.style.cursor = "pointer";             
            });
            if( this.on_cancel_selection){
                this.on_cancel_selection();
            }
            this.selected_item = null;
        }catch( errr )
        {
            alert( errr.message );
        }
    }
}

export class toolbox_group
{
    name;
    items = [];
    constructor( name, items )
    {
        this. name =  name;
        if( items ){
            this.items = items;
        }
    }
}

export class toolbox_item{
    name;
    image;
    constructor( name, image )
    {
        this.name = name;
        this.image= image;
    }
}
