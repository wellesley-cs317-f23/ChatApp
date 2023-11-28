// Utiity functions 

export function formatJSON(jsonVal) {
    // Lyn sez: replacing \n by <br/> not necesseary if use this CSS:
    //   white-space: break-spaces; (or pre-wrap)
    // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
    return JSON.stringify(jsonVal, null, 2);
  }
  
  /**
   * Return email address from Firebase signedIn user object
   */
  export function emailOf(user) {
    if (user) {
      return user.email;
    } else {
      return null;
    }
  }
  
  /**
   * Turn a date into a human readable string. 
   * For more info on formatting dates & times, see: 
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
   */
  export function formatDateTime(date) {
    // return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`; 
    return date.toLocaleString();
    }

  export function humanTime(isoTimeString) {
    return new Date(isoTimeString).toLocaleString();
  }

  /**
   * Returns a reversed shallow *copy* of the given array, which is not changed
   */
  export function reversed(array) {
    return [...array].reverse();
  }
  
  /** Show a popup alert dialog with msg and value before returning value */
  // Handy debugging functions                                                                   
  export function alertVal(msg, val) {
    alert(`${msg}:${JSON.stringify(val)}`);
    return val;
  }
  
  /** Write msg and value to console.log before returning value */
  export function logVal(msg, val) {
    console.log(`${msg}:${JSON.stringify(val)}`);
    return val;
  }
  
  
  