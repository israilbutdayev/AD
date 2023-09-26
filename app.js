import memoryjs from "memoryjs";
const processName = "AnyDesk.exe";
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const offsets_list = [
  [0x00b712e0, 0x8, 0x64, 0x54, 0x48, 0x14, 0x24, 0xb34],
  [0x00c2cab8, 0x8, 0x64, 0x3c, 0x4, 0x8, 0x10, 0x2b4],
];
for (let i = 0; i < 86400; i++) {
  await sleep(1000);
  const processes = memoryjs
    .getProcesses()
    .filter((p) => p.szExeFile.includes(processName));
  offsets_list.forEach((offsets) => {
    processes.forEach((p) => {
      try {
        const process = memoryjs.openProcess(p.th32ProcessID);
        const baseAddress = process.modBaseAddr;
        const handle = process.handle;
        const address = offsets
          .slice(1)
          .reduce(
            (p, c) => c + memoryjs.readMemory(handle, p, memoryjs.DWORD),
            baseAddress + offsets[0]
          );
        memoryjs.writeMemory(handle, address, 0, memoryjs.DWORD);
      } catch (error) {}
    });
  });
}
