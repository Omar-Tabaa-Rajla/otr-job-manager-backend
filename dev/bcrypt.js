import bcrypt from "bcrypt";

const password = "edward123";

// const salt = await bcrypt.genSalt();
// console.log(`salt: ${salt}`);
// const hash = await bcrypt.hash(password, salt);
// console.log(`hash: ${hash}`);

const databaseHash =
    "$2b$10$l.hIPrRrMkpH3wnsvEouxO/vVeBJu5aAbmRd7Hm.PEe3M7KwJMj.a";

console.log(await bcrypt.compare(password, databaseHash));
