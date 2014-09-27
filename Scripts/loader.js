//$(document).ready(function() {
    // $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
    //     var html = "" + data.contents;
        
    //     html = html.replace(new RegExp('(href|src)="/', 'g'),  '$1="'+url+'/');

    //     $("#siteLoader").html(html);
    // });

    function receiveMessage(event)
    {
        if(event.origin == "http://nicolasmiller.github.io") {
            console.log(event);
        }
    }

    addEventListener("message", receiveMessage, false);
//});
