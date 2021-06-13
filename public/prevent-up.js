// window scrolling control code written by: Tom Chung
// https://stackoverflow.com/questions/20296436/prevent-scroll-jump-during-refreshing-a-long-html-page
window.addEventListener('scroll', function () {
    localStorage.scrollX = window.scrollX;
    localStorage.scrollY = window.scrollY;
})
window.addEventListener('load',function () {
    window.scrollTo(localStorage.scrollX || 0, localStorage.scrollY || 0);
})