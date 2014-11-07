$.ajax({
    type: 'POST',
    complete: function () {
        console.log('done');
    },
    error: function () {
        console.log('error');
    }
})