const yargs = require("yargs");
const argv = yargs
  .option("read", {
    alias: "r",
    description: "Input json path",
    type: "string"
  })
  .option("delete", {
    alias: "d",
    description: "Name of extras to delete from all trackings separeted by blank spaces (eg.: idUser idMessage)",
    type: "array"
  })
  .option("overwrite", {
    alias: "o",
    description: "Overwrite extras values if they already exist",
    type: "boolean"
  })
  .option("all", {
    alias: "a",
    description: "Delete existing extras and add new",
    type: "boolean"
  })
  .help()
  .alias("help", "h")
  .argv;



var addextrastoscripts = function () {
    const readPath = argv.r ? argv.r : argv._[0];
    const deleteProperties = argv.d;
    const overwrite = argv.o;
    const overwriteAll = argv.a;
    
    var fs = require('fs')
    var exportfile = require('./Modules/exportfile')
    var jsonPath = readPath;

    var blipJson = {}

    try {
      blipJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    } catch (error) {
      console.log(error)
    }
    var addextras = require ('./Modules/addextras')
    let flow = addextras.addextrastoscripts(blipJson, deleteProperties, overwrite, overwriteAll)

    exportfile.savefile(flow)
   
}

addextrastoscripts()
