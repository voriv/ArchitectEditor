
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

export class element{
    type;
    name;
    attributes;
    constructor( name, type, attributes){
        this.name = name;
        this.type = type;

        this.attributes = attributes;
    }
}

export class digram_object{
    element;
    diagram;
    x;y;h;w;
    constructor( e,d,x,y,w,h ){
        this.element = e;
        this.diagram = d;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    formatSVG(){
        return this.element.type.shape_script( this );
    }
    set_position(x,y){
        this.x = x;
        this.y = y;
    }
}
export class diagram{
    name;
    type;
    model;
    objects = [];
    constructor( name, type, parent , model){
        this.name = name;
        this.type = type;
        this.model = model;
    }
    add_element(e, x, y,w,h){
        let obj = new digram_object( e,this, x,y,w,h );
        this.objects.push( obj );
        this.model.rise_event("object_changed", new diagram_object_changed( this, obj ));
        return obj;
    }
    create_element(name, type, x, y ,w,h ){
        return this.add_element( this.model.create_element(name, type) ,x,y,w,h);
    }
}

export class diagram_object_changed{
    diagram;
    object;
    constructor( d, o){
        this.diagram = d;
        this.object = o;
    }
}

export class element_changed{
    element;
    constructor(e){
        this.element = e;
    }
}

export class editor_model{
    types;
    technologies;
    elements = [];
    diagrams = [];
    constructor( technologies ){
        this.technologies = technologies;
    }
    active_diagram;
    add_diagram( name, type, parent){
        let d = new diagram( name, type, parent, this);
        this.diagrams.push( d );
        return d;
    }
    activate_diagram( d ){
        this.active_diagram = d;
    }


    create_element( name, type ){
        let e = new element( name, type);
        this.elements.push(e);
        this.rise_event("element_created", new element_changed(e) );
        return e;
        throw Error('not implemented');
    }
    //events
    event_handlers = {
    };
    add_event_handler( name, handler ){
        if( !this.event_handlers[name] ){
            this.event_handlers[name] = [];
         }

        this.event_handlers[name].push( handler );
    };
    rise_event( name, e ){
         if(this.event_handlers[name] ){
            this.event_handlers[name].forEach( h=>{
                h(e);
            });
        }
    }
}
