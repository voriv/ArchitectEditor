export class log_console{
    static attach( html_element )
    {
        this.html_element = html_element;
        this.html_element.onclick = e=>{ alert(this.log_buffer ) }
    }
    static html_element;
    static log_buffer = '';
    static log( e )
    {
        if( typeof e == "string" ){
            this.log_buffer = this.log_buffer + e + '\r\n'; 
        } else{
               log_console.log_buffer = log_console.log_buffer + JSON.stringify( e) + "\r\n";
        }
    }

}
