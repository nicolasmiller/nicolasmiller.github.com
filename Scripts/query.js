jQuery.extend({
    getQueryParameters : function(str) {
	return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    }
});


var queryParams = $.getQueryParameters();
console.log(queryParams);
$(document).ready(function() {
    console.log('iframe');
    console.log(document.getElementById("iframe"));
    document.getElementById("iframe").contentWindow.postMessage("This is a message", decodeURIComponent(queryParams['url']));
});
