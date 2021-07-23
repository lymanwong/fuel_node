<script>
var Webflow = Webflow || [];
Webflow.push(function () {
  // DOMready has fired
  // May now use jQuery and Webflow api
  $('.brandimage').on('click', function (){
    window.location.href='https://getfuelpod.com';
  });
  $('.inventory').on('click', function(){
    // Get the value of data-url
    var geturl = this.getAttribute('data-url');
    $('#content').empty();
    // Create a url using geturl
    var url = "https://api.scalablepress.com/v2/products/" + geturl + "/availability";
    console.log(url);
    // Make an ajax request using the url
    $.ajax({
      url: url,
      headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://www.getfuelpod.com/'
      },
      async: true,
      crossDomain: true,
      dataType:"json",
      async: true,
      method:"GET",
    }).done(function(data) {
      var items = [];
      var oosItems = ['<li style="background-color:#2196F3; color:white;" class="list-group-item active">' + "The following colors are out of stock" + '</li>'];
      Object.keys(supportedColors).forEach(function(supportedItem){
        if (geturl == supportedItem) {
          let supportedItemColors = supportedColors[supportedItem];
          Object.keys(data).forEach(function(color){
            var sizes = data[color];
            var sizesLength = Object.keys(sizes).length;
            var returnedColor = color.split(" ");
            var formattedColor = [];
            for (var c=0; c<returnedColor.length; c++) {
            formattedColor.push(returnedColor[c][0].toUpperCase() + returnedColor[c].substring(1));
            }
            formattedColor = formattedColor.join(" ");
            var capitalColor = formattedColor;
            //var capitalColor = color.charAt(0).toUpperCase() + color.slice(1);
            for (var i = 0; i < supportedItemColors.length; i++) {
              if (supportedItemColors[i].toLowerCase() === color.toLowerCase()) {
                if (sizesLength < 1 ) {
                  // Push the string with the color to the oosItems array
                  oosItems.push(
                    '<li class="list-group-item">' + capitalColor + '</li>'
                    );
                } else {
                  // Push the string with the color to the items array
                  items.push(
                      '<li class="list-group-item active" style="background-color:#2196F3; color:white;">' + capitalColor + '</li>'
                    );
                  // Loop through each size
                  for(key in sizes) {
                    // Check if the inventory count is less than 100
                    if (sizes[key] < 100) {
                      // Push the message with the out of stock message
                      items.push(
                      '<li class="list-group-item">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + ' <span style="color:red; font-size:.65rem;">Warning: Most likely out of stock</span>' + '</li>')
                    // Check if the inventory count is less than 150
                    } else if (sizes[key] < 200) {
                      // Push the content with the low stock message
                      items.push(
                      '<li class="list-group-item">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + ' <span style="color:red; font-size:.65rem;">Warning: Most likely out of stock</span>' + '</li>')
                    } else {
                      // Push the content with no message
                      items.push(
                          '<li class="list-group-item">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + '</li>'
                        );
                    }
                  }
                }
              }
            }
          })
        }
      })
      $('#content').append(items);
      $('#content').append(oosItems);
    })
});
})
</script>