<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous" async>
<script>
var Webflow = Webflow || [];
Webflow.push(function () {
  // DOMready has fired
  // May now use jQuery and Webflow api
  $('.brandimage').on('click', function (){
    window.location.href='https://getfuelpod.com';
  });
  $('.inventory').on('click', function () {
  $('#content').empty();
    let geturl = this.getAttribute('data-url');
    let url = "https://api.scalablepress.com/v2/products/" + geturl + "/availability";
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
      let items = [];
      let oosItems = ['<li class="list-group-item list-group-item-danger">' + "The following colors are out of stock" + '</li>'];
      Object.keys(supportedColors).forEach(function(supportedItem) {
      if (geturl == supportedItem) {
        let supportedItemColors = supportedColors[supportedItem];
        Object.keys(data).forEach(function(color){
          let sizes = data[color];
          let sizesLength = Object.keys(sizes).length;
          let capitalColor = color.charAt(0).toUpperCase() + color.slice(1);
             for (let i = 0; i < supportedItemColors.length; i++) {
                if (supportedItemColors[i][0].toLowerCase() === color.toLowerCase() )
                 {
                  if (sizesLength < 1) {
                     oosItems.push(
                        '<li class="list-group-item">' + capitalColor + ' <button data-itemcolor="' + supportedItemColors[i][3] + '" data-itemtype="' + supportedItemColors[i][2] + '" class="suggestColor" style="color:white;text-shadow: rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.416147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px;background-color:' + supportedItemColors[i][1] + ';"> '+ supportedItemColors[i][1] + '</button></li>'
                        );
                    } else {
                      items.push(
                          '<li class="list-group-item list-group-item-info zmar">' + capitalColor + ' <button data-itemcolor="' + supportedItemColors[i][3] + '" data-itemtype="' + supportedItemColors[i][2] + '" class="suggestColor" style="color:white;text-shadow: rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.416147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px;background-color:' + supportedItemColors[i][1] + ';"> '+ supportedItemColors[i][1] + '</button></li>'
                      );
                      for (key in sizes) {
                        if (sizes[key] < 100) {
                          items.push(
                          '<li class="list-group-item zmar">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + ' <span class="redwarning">Warning: Most likely out of stock</span>' + '</li>')
                        } else if (sizes[key] < 200 ) {
                          items.push(
                          '<li class="list-group-item zmar">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + ' <span class="redwarning">Warning: Low inventory</span>' + '</li>')
                        } else {
                          items.push(
                              '<li class="list-group-item zmar">' + key.toUpperCase() + ' - ' + sizes[key] + ' pieces' + '</li>'
                              );
                        }
                      }
                    }
                  }
              }
          });
        };
      })
      $('#content').append(items);
      let searchedItems = items;
      $('#content').append(oosItems);
      $(".suggestColor").bind("click", function(event){
        let buttonClickedColor = $(this).text();
        let buttonSuggestColor = $(this).attr('data-itemcolor');
        let buttonSuggestItemType = $(this).attr('data-itemtype');
        let suggestedColorsCollection = [];
        let suggestedObject = [];
        Object.keys(supportedColors).forEach(function(supportedItem) {
            let searchItem = supportedColors[supportedItem];
            for(var k = 0; k < searchItem.length; k++){
              if (searchItem[k][2] === buttonSuggestItemType) {
                  if (searchItem[k][3].includes(buttonSuggestColor)) {
                      if (suggestedObject[supportedItem] != undefined) {
                        suggestedObject[supportedItem] = [searchItem[k]];
                        suggestedColorsCollection.push('<li class="list-group-item zmar">' + searchItem[k][0] + ' <button data-itemcolor="' + searchItem[k][3] + '" data-itemtype="' + searchItem[k][2] + '" class="suggestColor" style="color:white;text-shadow: rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.416147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px;background-color:' + searchItem[k][1] + ';"> '+ searchItem[k][1] + '</button></li>');
                      } else {
                        suggestedObject[supportedItem] = [searchItem[k]];
                        let formattedSupportedItem = supportedItem.split('-').join(" ");
                        suggestedColorsCollection.push('<li class="list-group-item list-group-item-info zmar">' + formattedSupportedItem[0].toUpperCase() + formattedSupportedItem.substring(1) + '</li>');
                      }
                    }
              }
            }
        })
        $('#content').empty();
        $('#content').append('<li class="list-group-item active">' + "Similar colors for " + ' <button style="color:white;text-shadow: rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.416147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px;background-color:' + buttonClickedColor + ';"> ' + buttonClickedColor + '</li>');
        $('#content').append(suggestedColorsCollection);
      })
    })
   })
  $(".newsearch").click(function(){
    $('#content').empty();
    $('#content').append(searchedItems);
  });
})
</script>