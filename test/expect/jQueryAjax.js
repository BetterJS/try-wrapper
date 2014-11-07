$.ajax({
    type: 'POST',
    complete: function () {
        try {
            console.log('done');
        } catch (e) {
            console.error(e);
        }
    },
    error: function () {
        try {
            console.log('error');
        } catch (e) {
            console.error(e);
        }
    }
});