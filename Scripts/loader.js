function receiveMessage(event)
{
    var url = event['data'];
    if(event.origin === "http://nicolasmiller.github.io") {
        $.getJSON('http://whateverorigin.org/get?url=' + url + '&callback=?', function(data){
            var html = "" + data.contents;
            
            html = html.replace(new RegExp('(href|src)="/', 'g'),  '$1="' + url + '/');

            $("#siteLoader").html(html);
        });
    }
}

addEventListener("message", receiveMessage, false);
