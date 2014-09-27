function receiveMessage(event)
{
    if(event.origin === "http://nicolasmiller.github.io") {
        $.getJSON('http://whateverorigin.org/get?url=' + event['data'] + '&callback=?', function(data){
            var html = "" + data.contents;
            
            html = html.replace(new RegExp('(href|src)="/', 'g'),  '$1="'+url+'/');

            $("#siteLoader").html(html);
        });
    }
}

addEventListener("message", receiveMessage, false);
