function a() {
    try {
        dosomthing();
        console.log('hello world!');
    } catch (e) {
        console.error(e);
    }
}