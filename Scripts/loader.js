function receiveMessage(event)
{
    var url = event['data']['url'];
    var message = event['data']['message'];
    if(event.origin === "http://nicolasmiller.github.io") {
        $.getJSON('http://whateverorigin.org/get?url=' + url + '&callback=?', function(data){
            var html = "" + data.contents;
            
            html = html.replace(new RegExp('(href|src)="/', 'g'),  '$1="' + decodeURIComponent(url) + '/');

            html += '<h1>' + decodeURIComponent(message) + '</h1>';
            $("#siteLoader").html(html);
        });
    }
}

addEventListener("message", receiveMessage, false);
