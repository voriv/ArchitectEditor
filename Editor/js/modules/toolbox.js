export class toolbox_controller
{
    div;

    create_item_div( item)
    {
        let name_div = document.createElement('div');
        name_div.innerHTML = `${item.name}`;
        name_div.className = "toolbox_item";
        return name_div;
    }
    create_item_group_div( group )
    {
        let div = document.createElement("div");
        div.className = "toolbox_group";
        let name_div = document.createElement('div');
        name_div.className = "toolbox_group_name";
        name_div.innerHTML = `${group.name}`;
        div.appendChild( name_div );

        for( const i of group.items){
            div.appendChild( this.create_item_div( i ) );
        }
        //alert( div.outerHTML );
        return div;
    }

    constructor( div, groups )
    {
        this.div = div;
        for( const g of groups)
        {
            div.appendChild(this.create_item_group_div( g ));
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
    constructor( name )
    {
        this.name = name;
    }
}
