import { HTML } from "../tools/html.mjs";

export class scale_view {
    div;
    scale = 100;
    handlers = [];
    add_scale_changed_handler( h ){
        this.handlers.push(h);
    }
    scale_changed(){
        this.handlers.forEach( h=>{h(this.scale)} );
    }
    constructor(){
        let plus = HTML.div(
            {}, HTML.button("+", e=>{
                this.scale += 25;
                input_scale.value = `${this.scale}%`;
                this.scale_changed( scale );
        }));
        let minus = HTML.div({},HTML.button("-", e=>{
            this.scale -= 25;
            if( this.scale < 25 ) {
                this.scale = 25;
            }
            input_scale.value = `${this.scale}%`;
            this.scale_changed( scale );
        } ));

        let input_scale = HTML.input("100%")
        let scale = HTML.div({},input_scale );
        //pl
        this.div = HTML.div(
            {
                border: "1px solid gray",
                display : "flex",
                width: 300,
                height: "30",
                bottom: 10,
                left: 10,
                float: "left",
                position: "absolute",
                boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                cursor: "default",
                backgroundColor: "white"
            }, [plus, scale, minus]
        );
    }
}