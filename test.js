const { spawn } = require("child_process");
const nvidiaSmiCommand = "nvidia-smi";
const nvidiaArgsArr = [
  "--query-gpu=temperature.gpu,utilization.gpu,utilization.memory,memory.total,memory.free,memory.used,power.draw,clocks.mem,clocks.gr",
  "--format=csv",
  "-l",
  "2",
];

const nvidiaProcess = spawn(nvidiaSmiCommand, nvidiaArgsArr);

nvidiaProcess.stdout.on("data", (data) => {
  console.log(`stdout : ${data}`);
});

nvidiaProcess.stdout.on("close", (code) => {
  console.log(`we are going to close  : ${code}`);
});
