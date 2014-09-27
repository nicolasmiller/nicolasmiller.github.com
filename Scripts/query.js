jQuery.extend({
    getQueryParameters : function(str) {
	return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    }
});


var queryParams = $.getQueryParameters();
$(document).ready(function() {
    console.log('iframe');
    console.log(document.getElementById("iframe"));
    setTimeout(function() {
        console.log('firing');
    document.getElementById("iframe").contentWindow.postMessage("This is a message", location.origin)
}, 5000);
});
