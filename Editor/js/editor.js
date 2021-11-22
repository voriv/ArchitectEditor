import  SVG from "./modules/svg.js"
import  {log_console } from "./modules/log.js"
import  {toolbox_controller, toolbox_group, toolbox_item } from "./modules/toolbox.js"

function load()
{
    log_console.attach( document.getElementById('console') );
    try{
            let toolbox = new toolbox_controller(
            document.getElementById('toolbox') , [ new toolbox_group('Class', [ new toolbox_item('Class')]) ]
            );
        }catch( ee )
        {
            alert( ee.message + ee.stack);
        }
}

load();