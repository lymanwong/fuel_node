// Make an ajax request to the Scalable Press API
function callApi(url) {
  let theResponse = null;
  $.ajax({
    url: url,
    headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://www.getfuelpod.com/"
  },
    async: false,
    crossDomain: true,
    dataType:"json",
    method:"GET",
    success: function(data) {
      theResponse = data;
      },
    error: function() {
      alert("An error occurred.");
    }
  });
  return theResponse;
};

function clearResults() {
  // Remove resultset if this has already been run
  $("#content").empty();
  let tab = document.getElementById("staticBackdropLabel");
  tab.innerHTML = "Inventory Status (Updates every 4 hours)";
};

function appendItems (inStockItems, oosItems){
  // Add the content of the items array
  $("#content").append(inStockItems);
  // Add the content of the oosItems array
  $("#content").append(oosItems);
  $(".modal-body").scrollTop(0);
};

function getSupportColors (getUrl, retrievedData) {
    let collection = {};
    let items = new Array;
    let oosItems = ["<li class='list-group-item list-group-item-danger'>The following colors are out of stock</li>"];
    Object.keys(supportedColors).forEach(function(supportedItem) {
    //If the key matches what was clicked
      if (getUrl == supportedItem) {
      //Get the list of the supported colors for the matching product
      let supportedItemColors = supportedColors[supportedItem];
        // Loop over each key (color) in the returned SP data object. Note: "Color" is all of the colors in the inventory.
        Object.keys(retrievedData).forEach(function(color){
        // Get the sizes for a color and save it to a variable
          let sizes = retrievedData[color];
          // Get the length of the sizes available array
          let sizesLength = Object.keys(sizes).length;
          // Capitalize the first character of the color
          let capitalColor = color.charAt(0).toUpperCase() + color.slice(1);
          // Loop over each of the colors supported by Fuel
           for (let i = 0; i < supportedItemColors.length; i++) {
              if (supportedItemColors[i][0].toLowerCase() === color.toLowerCase()) {
                if (sizesLength < 1) {
                  // Push the string with the color to the oosItems array
                   oosItems.push(
                    `<li class="list-group-item"> ${capitalColor} <button data-itemcolor="${supportedItemColors[i][3]}" data-itemtype="${supportedItemColors[i][2]}" class="suggestColor boxStyling" style="background-color:${supportedItemColors[i][1]};">${supportedItemColors[i][1]}</button></li>`
                      );
                  }
                  else {
                    //Push the string with the color to the items array
                    items.push(
                      `<li class="list-group-item list-group-item-info"> ${capitalColor} <button data-itemcolor="${supportedItemColors[i][3]}" data-itemtype="${supportedItemColors[i][2]}" class="suggestColor supportedItemColorsStyle boxStyling" style="background-color:${supportedItemColors[i][1]};"> ${supportedItemColors[i][1]}</button></li>`
                    );
                    // Loop through each size
                    for (key in sizes) {
                      switch(true) {
                        // Check if the inventory count is less than 100
                        case sizes[key]<100:
                          items.push(
                          `<li class="list-group-item"> ${key.toUpperCase()} - ${sizes[key]} pieces <span class="redwarning">Warning: Most likely out of stock</span></li>`);
                          break;
                        // Check if the inventory count is less than 200
                        case sizes[key]<200:
                          items.push(
                          `<li class="list-group-item"> ${key.toUpperCase()} - ${sizes[key]} pieces <span class="redwarning">Warning: Low inventory</span></li>`);
                          break;
                        // Push the content with no message
                        default:
                          items.push(
                          `<li class="list-group-item"> ${key.toUpperCase()} - ${sizes[key]} pieces </li>`
                          );
                      }
                    }
                  }
                }
            }
        });
      };
    });
  collection.items = items;
  collection.oosItems = oosItems;
  return collection;
};

function addSuggestedColorsHandler(retrievedData){
  $(".suggestColor").bind("click", function(event){
      clearResults();
      let buttonClickedColor = $(this).text();
      let buttonSuggestColor = $(this).attr("data-itemcolor"); //Garment color category
      let buttonSuggestItemType = $(this).attr("data-itemtype"); //Garment category
      let suggestedColorsCollection = [];
      let suggestedObject = [];
      Object.keys(supportedColors).forEach(function(supportedItem) {
          // console.log(supportedColors[supportedItem]);
        let searchItem = supportedColors[supportedItem];
          for (var k = 0; k < searchItem.length; k++){
            if ((searchItem[k][2] === buttonSuggestItemType) && (searchItem[k][3].includes(buttonSuggestColor))) {
                if (suggestedObject[supportedItem] != undefined) {
                  suggestedObject[supportedItem] = [searchItem[k]];
                  suggestedColorsCollection.push(`<li class="list-group-item">${searchItem[k][0]} <button data-itemcolor="${searchItem[k][3]}" data-itemtype="${searchItem[k][2]}" data-brandtype="${supportedItem}" class="suggestColorCount boxStyling" style="background-color:${searchItem[k][1]};"> ${searchItem[k][1]}</button></li>`);
                }
                else {
                  suggestedObject[supportedItem] = [searchItem[k]];
                  let formattedSupportedItem = supportedItem.split('-').join(" ");
                  suggestedColorsCollection.push(`<li data-brandtype="${supportedItem}" class="list-group-item list-group-item-info ${supportedItem}">${formattedSupportedItem[0].toUpperCase()}${formattedSupportedItem.substring(1)}</li>`);
                }
              }
            }
        });
      let tab = document.getElementById("staticBackdropLabel");
      tab.innerHTML = `Similar colors for <button class="suggestColor boxStyling" style="background-color:${buttonClickedColor};">${buttonClickedColor}`;
    appendItems(suggestedColorsCollection);
    addSuggestedInventoryCountHandler(retrievedData); //why doesn't this work when placed
  });
};

function addSuggestedInventoryCountHandler(retrievedData){
  $(".suggestColorCount").bind("click", function(event){
    let colorText = $(this).offsetParent().text().split("  ")[0]; //color name e.g. blue ocean
    let brandType = $(this).attr("data-brandtype"); //brand of the garment e.g. gildan-cotton-t-shirt
    let buttonClickedColor = $(this).text(); //Hex of the button clicked e.g. #2c55ba
    let buttonSuggestColor = $(this).attr("data-itemcolor"); //General garment color category e.g. blue
    let buttonSuggestItemType = $(this).attr("data-itemtype"); //Garment category e.g. classic-unisex-t-shirt
    let items = new Array;
    let oosItems = ["<li class='list-group-item list-group-item-danger'>The following colors are out of stock</li>"]; // remove not using
    //Create a url using geturl
    let getUrl = this.getAttribute(brandType);  //remove since not using
    let spApiUrl = `https://api.scalablepress.com/v2/products/${brandType}/availability`;
    //ajax api request to get inventory object data for a brand and save it to retrievedData
    let retrievedData = callApi(spApiUrl);
    let downcase = colorText.toLowerCase();
    let sizes = retrievedData[downcase];
    items.push(
                `<li class="list-group-item list-group-item-info"> ${colorText} <button data-itemcolor="${buttonSuggestColor}" data-itemtype="${buttonSuggestItemType}" class="suggestColor supportedItemColorsStyle boxStyling" style="background-color:${buttonClickedColor};"> ${buttonClickedColor}</button></li>`
                    );
    for (size in sizes) {
      switch(true) {
        // Check if the inventory count is less than 100
        case sizes[size]<100:
          items.push(
          `<li class="list-group-item"> ${size.toUpperCase()} - ${sizes[size]} pieces <span class="redwarning">Warning: Most likely out of stock</span></li>`);
          break;
        // Check if the inventory count is less than 200
        case sizes[size]<200:
          items.push(
          `<li class="list-group-item"> ${size.toUpperCase()} - ${sizes[size]} pieces <span class="redwarning">Warning: Low inventory</span></li>`);
          break;
        // Push the content with no message
        default:
          items.push(
          `<li class="list-group-item"> ${size.toUpperCase()} - ${sizes[size]} pieces </li>`
          );
      }
      // if (sizes[size] < 100) {
      //    items.push(
      //     `<li class="list-group-item"> ${size.toUpperCase()} - ${sizes[size]} pieces <span class="redwarning">Warning: Most likely out of stock</span></li>`);
      //  } else if (101 < size[size] < 200) {
      //   items.push(
      //     `<li class="list-group-item"> ${size.toUpperCase()} - ${sizes[size]} pieces <span class="redwarning">Warning: Low inventory</span></li>`);
      // } else {
      //     items.push(
      //     `<li class="list-group-item"> ${size.toUpperCase()} - ${sizes[size]} pieces </li>`
      // );
      // }
    }
      // console.log(size); // letter size
      // console.log(sizes[size]); //count
    clearResults();
    appendItems(items);
    addSuggestedColorsHandler();
  });
};

function addSuggestedColors() {
  clearResults();
  //Add a line to tell the user which color we are searching for
  let tab = document.getElementById("staticBackdropLabel");
  tab.innerHTML = `Similar colors for <button class="suggestColor boxStyling" style="background-color:${buttonClickedColor};">${buttonClickedColor}`;
  // $("#content").append(`<li class="list-group-item active">Similar colors for <button class="boxStyling" style="background-color:${buttonClickedColor};">${buttonClickedColor}</li>`);
  //Append the suggested color list
  appendItems(gotSuggestedColors);
};

function getSuggestedColors(supportedColors, myButtonValues) {
  clearResults();
  let suggestedColorsCollection = [];
  let suggestedObject = [];
  Object.keys(supportedColors).forEach(function(supportedItem) {
    let searchItem = supportedColors[supportedItem];
    for(var k = 0; k < searchItem.length; k++){  //can combine with a conditional and/or
      if (searchItem[k][2] === myButtonValues.buttonSuggestItemType && searchItem[k][3].includes(myButtonValues.buttonSuggestColor) && suggestedObject[supportedItem] != undefined) {
        suggestedObject[supportedItem] = [searchItem[k]];
        suggestedColorsCollection.push(`<li class="list-group-item"> ${searchItem[k][0]} <button data-itemcolor="${searchItem[k][3]}" data-itemtype="${searchItem[k][2]}" class="suggestColor boxStyling" style="background-color:${searchItem[k][1]};"> ${searchItem[k][1]}</button></li>`);
      }
      else {
        suggestedObject[supportedItem] = [searchItem[k]];
        let formattedSupportedItem = supportedItem.split('-').join(" ");
        suggestedColorsCollection.push(`<li class="list-group-item list-group-item-info"> ${formattedSupportedItem[0].toUpperCase()}${formattedSupportedItem.substring(1)}</li>`);
        suggestedColorsCollection.push(`<li class="list-group-item"> ${searchItem[k][0]} <button data-itemcolor="${searchItem[k][3]}" data-itemtype="${searchItem[k][2]}" class="suggestColor boxStyling" style="background-color:${searchItem[k][1]};"> ${searchItem[k][1]}</button></li>`);
        }
      }
  })
  return {suggestedColorsCollection,suggestedObject};
};
