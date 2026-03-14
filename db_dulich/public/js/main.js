$('#paging').pagination({
    dataSource: '/user?page=1',
    locator: 'data',
    totalNumberLocator: function(response) {
        // you can return totalNumber by analyzing response content
        return response.total;
    },
    pageSize: 2,

        afterPreviousOnClick: function(event, pageNumber){
            loadPage(pageNumber)
        },

        afterPageOnClick: function(event, pageNumber){
            loadPage(pageNumber)
        },

        afterNextOnClick : function(event, pageNumber){
            loadPage(pageNumber)
        }
})

function loadPage(page){
    $('#content').html('')
    $.ajax({
        url: '/user?page='+page,
    })
    .then(rs => {
        console.log(rs.tongSoPage);
        for (let i = 0; i < rs.data.length; i++) {
            const element = rs.data[i];
            var item = $(`<h3>${element.username}</3>`)
            $('#content').append(item)
        }
      })
      .catch(err => {
        console.log(err)
      })
}

loadPage(1)