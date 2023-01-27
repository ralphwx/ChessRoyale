
//functions used for encrypting passwords. They're very weak right now but
//making them stronger will be a TODO for the future.
function makeSalt(n) {
  let output = []
  for(let i = 0; i < n; i++) output.push("a");
  return output.join("");
}

function makeHash(str) {
  let output = 0;
  for(let i = 0; i < str.length; i++) {
    output = output * 31 + str.charCodeAt(i);
  }
  return output;
}

export {makeSalt, makeHash};
