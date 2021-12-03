
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

export class model_techology{
    types;
    name;
    constructor( name, types ){
        this.name = name;
        this.types = types;
    }
}

export class editor_model{
    types;
    technologies;
    constructor( technologies ){
        this.technologies = technologies;
    }
}
