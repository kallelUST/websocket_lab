const WebSocket = require("ws");
const { exec } = require("child_process");
const { stdout } = require("process");

const { spawn } = require("child_process");
const nvidiaSmiCommand = "nvidia-smi";
const nvidiaArgsArr = [
  "--query-gpu=temperature.gpu,utilization.gpu,utilization.memory,memory.total,memory.free,memory.used,power.draw,clocks.mem,clocks.gr",
  "--format=csv,nounits,noheader",
  "-l",
  "2",
];

const wss = new WebSocket.Server({ host: "127.0.0.1", port: 8080 });

console.log("Server running on 8080");

wss.on("connection", (ws) => {
  console.log("Connection opened");
  // sendData(ws);
  // fetchNvidiaGPUData(ws);
  const nvidiaProcess = spawn(nvidiaSmiCommand, nvidiaArgsArr);

  nvidiaProcess.stdout.on("data", (data) => {
    console.log(`stdout : ${data}`);
    fetchNvidiaGPUData(`${data}`, ws);
  });

  ws.on("close", () => {
    console.log("Connection closed");
    clearTimeout(ws.timeoutId);
  });
});

// function fetchNvidiaGPUData(ws) {
//   exec(
//     // you should add fan.speed (maybe it is relevant in the GPU)
//     "nvidia-smi --query-gpu=temperature.gpu,utilization.gpu,utilization.memory,memory.total,memory.free,memory.used,power.draw,clocks.mem,clocks.gr  --format=csv,noheader,nounits",

//     (error, stdout, stderr) => {
//       if (error) {
//         console.err(`Error executing nvidia-smi: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`nvidia-smi stderr: ${stderr}`);
//         return;
//       }
//       // console.log(stdout.split(","));
//       statsArr = stdout.split(",");
//       [
//         temperatureGPU,
//         utilizationGPU,
//         utilizationMemory,
//         totalMemory,
//         freeMemory,
//         usedMemory,
//         usedPower,
//         clockMemory,
//         clockGraphics,
//       ] = statsArr;

//       jsonToSend = JSON.stringify({
//         time: Date.now(),
//         temperatureGPU,
//         utilizationGPU,
//         utilizationMemory,
//         totalMemory,
//         freeMemory,
//         usedMemory,
//         usedPower,
//         clockMemory,
//         clockGraphics,
//       });
//       ws.send(jsonToSend);
//       ws.timeoutId = setTimeout(() => {
//         fetchNvidiaGPUData(ws);
//       }, 1000);
//     }
//   );
// }
// {"time":1711439767124,"temperatureGPU":"45","utilizationGPU":" 0","utilizationMemory":" 0","totalMemory":" 4096","freeMemory":" 3932","usedMemory":" 44","usedPower":" 3.90","clockMemory":" 405","clockGraphics":" 210\n"}
function fetchNvidiaGPUData(data, ws) {
  // console.log(stdout.split(","));
  statsArr = data.split(",");
  [
    temperatureGPU,
    utilizationGPU,
    utilizationMemory,
    totalMemory,
    freeMemory,
    usedMemory,
    usedPower,
    clockMemory,
    clockGraphics,
  ] = statsArr;

  jsonToSend = JSON.stringify({
    time: Date.now(),
    temperatureGPU,
    utilizationGPU,
    utilizationMemory,
    totalMemory,
    freeMemory,
    usedMemory,
    usedPower,
    clockMemory,
    clockGraphics,
  });
  ws.send(jsonToSend);
}
