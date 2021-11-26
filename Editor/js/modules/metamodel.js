export class object_type
{
    constructor( name, icon, shape_script, set_default )
    {
        this.name = name;
        this.shape_script = shape_script;
        this.icon = icon;
        this.set_default = set_default;
    }
    name;
    shape_script;
    icon;
    set_default;
}


export class model{
    entities = [];
    diagrams = [];
    create_element(type, name){
        if( !name )
        {
            name = type.name;
        }
 
        let ret = new element( type, name, this );
        if( type.set_default ){
            type.set_default( ret );
        }

        this.entities.push( ret );
        return ret;
    }
    create_diagram( name ){
        let ret = new diagram( name, this );
        this.diagrams.push( ret );
        return ret;
    }
}

export class diagram{
    name;
    model;
    objects = [];
    constructor( name, model )
    {
        this.name = name;
        this.model = model;
    }
    create_object( type, name, x, y, w, h){
        let el = this.model.create_element( type, name, this.model );
        let dgo = new diagram_object( el,this, x, y,w, h );
        this.objects.push( dgo );
        return dgo;
    }
}

export class element
{
    type;
    name;
    model;
    constructor( type, name, model ){
        this.type = type;
        this.name = name;
        this.model = model;
    }
}

export class diagram_object
{
    element;
    diagram;
    x;
    y;
    w;
    h;

    constructor( element , dg, x, y, w, h ){
        this.element = element;
        this.diagram =  dg;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.format_svg();
    }
    format_svg(){
        return this.element.type.shape_script( this );
    }
}