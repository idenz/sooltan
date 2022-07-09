#! /usr/bin/env node
const yargs = require("yargs");
const fs = require("fs");
const readline = require("readline")


/** Use yargs for handling arguments */
const usage = "\nUsage: mytools <direktori_log>";
const options = yargs
      .usage(usage)
      .option("t", { alias: "format", describe: "Format type convertion json/text", type: "string", demandOption: false, })
      .option("o", { alias: "output", describe: "File directory output", type: "string", demandOption: false, })
      .help(true)
      .argv;

/** check argument 0 (directory error.log) */
if(yargs.argv._[0] == null){
  console.log("\nHelp: mytools --help");
  return;
}

/** Get from argument */
const format_output = yargs.argv.t || yargs.argv.format
const argument_output = yargs.argv.o || yargs.argv.output
const dir_output = argument_output ? argument_output : "./ngixlog." + (!format_output || format_output === "text" ? "txt" : format_output);

/** Read line by line  */
const file = readline.createInterface({
  input: fs.createReadStream(yargs.argv._[0]),
  output: process.stdout,
  terminal: false,
});

file.on('line', function(data) {
  let splited = data.split(" ");

  const content = convert(splited, format_output)

  /** Write content after convert */
  fs.appendFile(dir_output, content + '\n' , (err) => {
    if (err) console.log(err);
  });
})

file.on('close', function(data) {
  console.log("Sucess converted!");
})

/** Function convert
 * json
 * text
 */
function convert(data, type){

  let result

  const date = `${data[0]} ${data[1]}`
  const status = `${data[2].replace(/\W/g, '')}`
  const path = data[6]
  const message = `${data[8]} ${data[9]} ${data[10]} ${data[11]} ${data[12]} ${data[13]} ${data[14]} ${data[15]}`
  const client = `${data[17]}`
  const server = `${data[19]}`
  const request = `${data[21]} ${data[22]} ${data[23]}`
  const host = data[25]
  const referrer = `${data[27]}`

  const json = {
    date,
    status,
    path,
    message,
    client,
    server,
    request,
    host,
    referrer,
  };

  switch (type) {
    case "json":
      result = JSON.stringify(json) + ","
      break;
    case "text":
      result = data.join(" ")
      break;

    default:
      result = data.join(" ")
      break;
  }

  return result
}