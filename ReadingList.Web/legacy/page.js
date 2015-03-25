$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://readinglist-pguru.azure-mobile.net/', 'RTwNiNJFOelgGTVGQwwzvOwaSAsaCd69'),
        readingListTable = client.getTable('readinglistitems');

    // Read current data and rebuild UI.
    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
    function refresh() {
        var query = readingListTable.where({});

        query.read().then(function(items) {
            var listItems = $.map(items, function(item) {
                return $('<li>')
                    .attr('data-item-id', item.id)
                    //.append($('<button class="item-delete">Delete</button>'))
                    .append($('<input type="checkbox" class="item-complete">').prop('checked', item.read))
                    .append($('<div>').append($('<a class="item-text" href="' + item.url + '">' + item.text + '</a>')))
                    //.append($('<div>').append($('<input class="item-text">').val(item.text)).append($('<a class="item-text" href="' + item.url + '">' + item.text + '</a>')))
                    //.append($('<span>').append($('<input class="item-text">').val(item.url)))
                ;
            });

            $('#items').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('<strong>' + listItems.length + '</strong> item(s)');
        }, handleError);
    }

    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    function getId(formElement) {
        return $(formElement).closest('li').attr('data-item-id');
    }

    // Handle insert
    $('#add-item').submit(function(evt) {
        var textbox = $('#new-item-text'),
            itemText = textbox.val();
        var urlbox = $('#new-item-url'),
            urlText = urlbox.val();

        if (itemText !== '' && urlText !== '') {
            readingListTable.insert({ text: itemText, url: urlText, read: false }).then(refresh, handleError);
        }
        urlbox.val('');
        textbox.val('').focus();
        evt.preventDefault();
    });

    // Handle update
    //$(document.body).on('change', '.item-text', function() {
    //    var newText = $(this).val();
    //    todoItemTable.update({ id: getTodoItemId(this), text: newText }).then(null, handleError);
    //});

    $(document.body).on('change', '.item-complete', function() {
        var read = $(this).prop('checked');
        readingListTable.update({ id: getId(this), read: read}).then(refresh, handleError);
    });

    // Handle delete
    //$(document.body).on('click', '.item-delete', function () {
    //    todoItemTable.del({ id: getTodoItemId(this) }).then(refreshTodoItems, handleError);
    //});

    // On initial load, start by fetching the current data
    refresh();
});