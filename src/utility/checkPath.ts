import * as fs from "fs-extra";

export function checkPath(path: string, createIfNotExist = false): boolean {
    if (fs.existsSync(path)) {
        // Do something
        console.log("esiste");
        return true;
    } else {
        console.log("non esiste");
        if (createIfNotExist === true) {
            fs.mkdir(path).then(value => {
                console.log(value, "create");
                return true;
            }).catch(error => console.error(error));
        } else {
            return false;
        }
    }
}