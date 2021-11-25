var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

const base64 = base64_encode("C:/GIT/Github/ArchitectEditor/Editor/image/c4model/system.png");
console.log( base64);