export class object_type
{
    constructor( name, shape_script )
    {
        this.name = name;
        this.shape_script = shape_script;
    }
    name;
    shape_script;
    icon;
}

export class diagram_object
{
    type;
    name;
    constructor( type, name ){
        this.type = type;
        this.name = name;
    }
}