(function ($) {

  //Top 5 A-C Button
  $('.inventory').on('click', function () {
    // remove resultset if this has already been run
    $('#content ul').remove();
    var geturl = this.getAttribute('data-url');
    var url = "https://api.scalablepress.com/v2/products/" + geturl + "/availability";
    console.log(url);
    $.ajax({
      url: url,
    }).done(function(data) {
      var items = [];
      Object.keys(data).forEach(function(color){
        var sizes = data[color];
        var capitalColor = color.charAt(0).toUpperCase() + color.slice(1);
        items.push(
            '<li class="list-group-item active">' + capitalColor + '</li>'
          );
          for (const key in sizes) {
          console.log(key + sizes[key]);
            items.push(
                '<li class="list-group-item">' + key + ' ' + sizes[key] + '</li>'
              );
            items.push('</ul>');
          }
      })
      $('#content').append(items);
    })
   })

  // $("#2000gildan").hover(function(){
  //   $("#gildancard").attr('src', 'images/2000gildan.png');
  // });
  // $("#5000gildan").hover(function(){
  //   $("#gildancard").attr('src', 'images/5000gildan.png');
  // });

  // $('.btn').mouseover(function(){
  //   var getImage = this.id;
  //   console.log(getImage);
  //   var newImage = 'images/' + getImage + '.png';
  //   console.log(newImage);
  //   $(getImage).attr('src', newImage);
  // });

  $(".newsearch").click(function(){
    $('#content').empty();
  });

}(jQuery));
