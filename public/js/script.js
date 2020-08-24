(function ($) {
  // When clicking a button with the inventory class
  $('.inventory').on('click', function () {
    // Remove resultset if this has already been run
    $('#content').empty();
    // Get the value of data-url
    var geturl = this.getAttribute('data-url');
    // Create a url using geturl
    var url = "https://api.scalablepress.com/v2/products/" + geturl + "/availability";
    // Make an ajax request using the url
    $.ajax({
      url: url,
    }).done(function(data) {
      var items = [];
      var oosItems = ['<li class="list-group-item active">' + "The following colors are out of stock" + '</li>'];
      // Loop over each key (color) in the object
      Object.keys(data).forEach(function(color){
        var sizes = data[color];
        // Get the length of the value (sizes)
        var sizesLength = Object.keys(sizes).length;
        // Capitalize the first character of the color
        var capitalColor = color.charAt(0).toUpperCase() + color.slice(1);
        // If the length of the value is less than 1 (object)
        if (sizesLength < 1) {
          // Push the string with the color to the oosItems array
          oosItems.push(
            '<li class="list-group-item">' + capitalColor + '</li>'
            );
          // If the length of the value is greater than 1
        } else {
          // Push the string with the color to the items array
        items.push(
            '<li class="list-group-item active">' + capitalColor + '</li>'
          );
          // For each size option
          for (const key in sizes) {
            // Push the string with the size and count into the items array
            items.push(
                '<li class="list-group-item">' + key + ' - ' + sizes[key] + ' pieces' +'</li>'
              );
          }
        }
      })
      // Add the content of the items array
      $('#content').append(items);
      // Add the content of the oosItems array
      $('#content').append(oosItems);
    })
   })

  $(".newsearch").click(function(){
    $('#content').empty();
  });

}(jQuery));
