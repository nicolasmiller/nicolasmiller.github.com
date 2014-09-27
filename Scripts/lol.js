$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
    var html = "" + data.contents;
    
    html = html.replace(new RegExp('(href|src)="/', 'g'),  '$1="'+url+'/');

    $("#siteLoader").html(html);
});

function receiveMessage(event)
{
  alert(event.data);
}

addEventListener("message", receiveMessage, false);
