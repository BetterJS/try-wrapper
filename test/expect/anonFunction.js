var a = function () {
    try {
        dosomthing();
        console.log('hello world!');
    } catch (e) {
        console.error(e);
    }
};