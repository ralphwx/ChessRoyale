import {userExists, authenticate, getElo, setElo, createUser, deleteUser} from "./users.mjs";

console.log(userExists("ralphwx")); //false
createUser("ralphwx", "password");
console.log(authenticate("ralphwx", "password")); //true
console.log(authenticate("ralphwx", "passwor")); //false
console.log(getElo("ralphwx") === 1000); //true
setElo("ralphwx", 1400);
console.log(getElo("ralphwx") === 1000); //false
console.log(getElo("ralphwx") === 1400); //true
console.log(userExists("ralphwx")); //true
console.log(authenticate("ralphwx", "password")) //true
deleteUser("ralphwx");
console.log(userExists("ralphwx")); //false
