function a() {
    try {
        return function () {
            try {
                console.log('hello world');
            } catch (e) {
                console.error(e);
            }
        };
    } catch (e) {
        console.error(e);
    }
}