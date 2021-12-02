(function ($) {
  // When clicking a button with the inventory class
  $(".card-body").on("click", "button", function (event) {
    // Get the value of data-url
    let getUrl = this.getAttribute("data-url");
    // Create a url using geturl
    let spApiUrl = `https://api.scalablepress.com/v2/products/${getUrl}/availability`;
    //ajax api request to get inventory data and save it to retrievedData
    let retrievedData = callApi(spApiUrl);
    //Get the inventory for colors Fuel support by comparing our master list & dismiss those we don't support
    //Accessed by gotSupportedColors.items or gotSupportedColors.oositems
    let gotSupportedColors = getSupportColors(getUrl,retrievedData);
    // Remove resultset if this has already been run
    clearResults();
    //append in stock and oos items to the apporpriate array to display
    appendItems(gotSupportedColors.items, gotSupportedColors.oosItems);
    addSuggestedColorsHandler();
  });

}(jQuery));