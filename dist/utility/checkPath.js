"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
function checkPath(path, createIfNotExist = false) {
    if (fs.existsSync(path)) {
        // Do something
        console.log("esiste");
        return true;
    }
    else {
        console.log("non esiste");
        if (createIfNotExist === true) {
            fs.mkdir(path).then(value => {
                console.log(value, "create");
                return true;
            }).catch(error => console.error(error));
        }
        else {
            return false;
        }
    }
}
exports.checkPath = checkPath;
//# sourceMappingURL=checkPath.js.map