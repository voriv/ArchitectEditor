import { HTML } from "../tools/html.mjs";

export class property_view {
    model;
    active_obj;
    constructor(model) {
        this.model = model;
        this.formatHTML();
    }

    header() {
        return HTML.div({
            backgroundColor: "lightgray",
            width: "100%",
            border: "1px solid  gray",
            textAlign: "left",
        }, "Property");
    }

    object;

    table;

    show_object(obj) {
        this.object = obj;
        if (this.table) {
            this.div.removeChild(this.table);
            this.table = null;
        }
        this.table = this.format_content();
        this.div.appendChild(this.table);
    }

    format_content() {
        const rows = [];
        rows.push( HTML.tr(
            [HTML.td("Name"), HTML.td(`${this.object.element.name}`)]
        ));

        for( const key of ["x", "y", "w", "h"]){
            rows.push( HTML.tr(
                [HTML.td( key ), HTML.td( `${this.object[key]}`)]
            ));
        }
        return HTML.table({ border: 1, width: "100%" },
            HTML.colgroup(
                [HTML.col(null, " 30%")]),
            HTML.tbody(
                rows
            ), { borderCollapse: "collapse"}
        );
    }

    formatHTML() {
        this.div = HTML.div(
            {
                border: "1px solid gray",
                width: 300,
                height: "80%",
                top: 20,
                right: 10,
                float: "left",
                position: "absolute",
                boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                cursor: "default",
                backgroundColor: "white"
            }, [this.header()]
        );
    }
}