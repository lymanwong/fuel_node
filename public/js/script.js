(function ($) {
  // When clicking a button with the inventory class
  $('.inventory').on('click', function () {
    // Remove resultset if this has already been run
    $('#content').empty();
    // Get the value of data-url
    let geturl = this.getAttribute('data-url');
    // Create a url using geturl
    let url = "https://api.scalablepress.com/v2/products/" + geturl + "/availability";
    // Make an ajax request to the Scalable Press API
    $.ajax({
      url: url,
    }).done(function(data) {
      // Create a variable to hold all of the items in stock
      let items = [];
      // Create a variable to hold all of the out of stock items
      let oosItems = ['<li class="list-group-item active">' + "The following colors are out of stock" + '</li>'];
      //Loop over each key in supportedColors
      Object.keys(supportedColors).forEach(function(supportedItem) {
      //If the key matches what was clicked
      if (geturl == supportedItem) {
        //Get the list of the supported colors for the matching product
        let supportedItemColors = supportedColors[supportedItem];
        // Loop over each key (color) in the returned SP data object. Note: "Color" is all of the colors in the inventory.
        Object.keys(data).forEach(function(color){
          // Get the sizes for a color and save it to a variable
          let sizes = data[color];
          // Get the length of the sizes available array
          let sizesLength = Object.keys(sizes).length;
          // Capitalize the first character of the color
          let capitalColor = color.charAt(0).toUpperCase() + color.slice(1);
            // Loop over each of the colors supported by Fuel
             for (let i = 0; i < supportedItemColors.length; i++) {
                // If a color matches from the SP inventory a color Fuel supports
                if (supportedItemColors[i].toLowerCase() === color.toLowerCase() ) {
                  // If the length is less than 1 (out of stock)
                    if (sizesLength < 1 ) {
                      // Push the string with the color to the oosItems array
                      oosItems.push(
                        '<li class="list-group-item">' + capitalColor + '</li>'
                        );
                    } else {
                      // Push the string with the color to the items array
                      items.push(
                          '<li class="list-group-item active">' + capitalColor + '</li>'
                        );
                      // Loop through each size
                      for(key in sizes) {
                        // Check if the inventory count is less than 100
                        if (sizes[key] < 100) {
                          // Push the message with the out of stock message
                          items.push(
                          '<li class="list-group-item">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + ' <span class="redwarning">Warning: Most likely out of stock</span>' + '</li>')
                        // Check if the inventory count is less than 150
                        } else if (sizes[key] < 200) {
                          // Push the content with the low stock message
                          items.push(
                          '<li class="list-group-item">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + ' <span class="redwarning">Warning: Low inventory</span>' + '</li>')
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
          });
        };
      })
      // Add the content of the items array
      $('#content').append(items);
      // Add the content of the oosItems array
      $('#content').append(oosItems);
    })
   })
  // Clear the current search
  $(".newsearch").click(function(){
    $('#content').empty();
  });
}(jQuery));
