document.querySelector('#sprk-icons').innerHTML =
  '<svg xmlns="http://www.w3.org/2000/svg" style="display:none"></svg>';
let event;
if (typeof Event === 'function') {
  event = new Event('sprk-icons-loaded');
} else {
  event = document.createEvent('Event');
  event.initEvent('sprk-icons-loaded', true, true);
}

window.dispatchEvent(event);
