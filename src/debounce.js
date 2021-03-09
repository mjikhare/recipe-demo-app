export default function debounce(func, wait) {
  let timeout;
  return function(...args) {
    //the returned function that will be invoked many times
    let that = this; //returned function will be called as event handler so this will capture the event handler 'this'
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    function later() {
      func.apply(that, args); //let func access the event handler 'this'
    }
  };
}
