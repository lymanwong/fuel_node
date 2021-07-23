(function ($) {
  // When clicking a button with the inventory class
  $(".card-body").on("click", 'button', function (event) {
    // Remove resultset if this has already been run
    $('#content').empty();
    $('#content2').empty();
    // Get the value of data-url
    let geturl = this.getAttribute('data-url');
    // Create a url using geturl
    let url = "https://api.scalablepress.com/v2/products/" + geturl + "/availability";
    //console.log(url);
    // Make an ajax request to the Scalable Press API
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
      // Create a variable to hold all of the items in stock
      let items = [];
      // Create a variable to hold all of the out of stock items
      let oosItems = ['<li class="list-group-item list-group-item-danger">' + "The following colors are out of stock" + '</li>'];
      //console.log(data);
      //Loop over each key in supportedColors
      Object.keys(supportedColors).forEach(function(supportedItem) {
      //If the key matches what was clicked
      if (geturl == supportedItem) {
        //Get the list of the supported colors for the matching product
        //console.log(supportedItem);
        let supportedItemColors = supportedColors[supportedItem];
        // Loop over each key (color) in the returned SP data object. Note: "Color" is all of the colors in the inventory.
        Object.keys(data).forEach(function(color){
          // Get the sizes for a color and save it to a variable
          let sizes = data[color];
          // Get the length of the sizes available array
          let sizesLength = Object.keys(sizes).length;
          // console.log(sizesLength);
          // Capitalize the first character of the color
          let capitalColor = color.charAt(0).toUpperCase() + color.slice(1);
            // Loop over each of the colors supported by Fuel
             for (let i = 0; i < supportedItemColors.length; i++) {
                if (supportedItemColors[i][0].toLowerCase() === color.toLowerCase() )
                  // console.log(color);
                 {
                  if (sizesLength < 1) {
                    // Push the string with the color to the oosItems array
                     oosItems.push(
                        '<li class="list-group-item">' + capitalColor + ' <button data-itemcolor="' + supportedItemColors[i][3] + '" data-itemtype="' + supportedItemColors[i][2] + '" class="suggestColor" style="color:white;background-color:' + supportedItemColors[i][1] + ';"> '+ supportedItemColors[i][1] + '</button></li>'
                        );
                    } else {
                      //Push the string with the color to the items array
                      items.push(
                          '<li class="list-group-item list-group-item-info">' + capitalColor + ' <button data-itemcolor="' + supportedItemColors[i][3] + '" data-itemtype="' + supportedItemColors[i][2] + '" class="suggestColor" style="color:white;background-color:' + supportedItemColors[i][1] + ';"> '+ supportedItemColors[i][1] + '</button></li>'
                      );
                      // Loop through each size
                      for (key in sizes) {
                        // Check if the inventory count is less than 100
                        if (sizes[key] < 100) {
                          // Push the message with the out of stock message
                          items.push(
                          '<li class="list-group-item">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + ' <span class="redwarning">Warning: Most likely out of stock</span>' + '</li>')
                          // Check if the inventory count is less than 150
                        } else if (sizes[key] < 200 ) {
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
      // Add click handler after the button populates the modal
      $(".suggestColor").bind("click", function(event){
        let buttonClickedColor = $(this).text();
        let buttonSuggestColor = $(this).attr('data-itemcolor'); //Garment color category
        let buttonSuggestItemType = $(this).attr('data-itemtype'); //Garment category
        let suggestedColorsCollection = [];
        let suggestedObject = [];
        //loop through supported colors
        Object.keys(supportedColors).forEach(function(supportedItem) {
            // console.log(supportedColors[supportedItem]);
            let searchItem = supportedColors[supportedItem];
            for(var k = 0; k < searchItem.length; k++){
              if (searchItem[k][2] === buttonSuggestItemType) {
                  if (searchItem[k][3].includes(buttonSuggestColor)) {
                      if (suggestedObject[supportedItem] != undefined) {
                        suggestedObject[supportedItem] = [searchItem[k]];
                        suggestedColorsCollection.push('<li class="list-group-item">' + searchItem[k][0] + ' <button data-itemcolor="' + searchItem[k][3] + '" data-itemtype="' + searchItem[k][2] + '" class="suggestColor" style="color:white;background-color:' + searchItem[k][1] + ';"> '+ searchItem[k][1] + '</button></li>');
                      } else {
                        suggestedObject[supportedItem] = [searchItem[k]];
                        suggestedColorsCollection.push('<li class="list-group-item list-group-item-info">' + supportedItem + '</li>');
                      }
                    }
              }
            }
        })
        $('#content').empty();
        $('#content').append('<li class="list-group-item active">' + "Similar colors for " + ' <button style="color:white;background-color:' + buttonClickedColor + ';"> ' + buttonClickedColor + '</li>');
        $('#content').append(suggestedColorsCollection);
      })
    })
   })
  // Clear the current search
  $(".newsearch").click(function(){
    $('#content').empty();
  });
}(jQuery));