var test_array = [1.1, 2.2, 3.3];

# print jsobject data and metadata
%DebugPrint(test_array);

# create a core dump and exit
%SystemBreak();

# Force a JIT on next call of f
%OptimizeFunctionOnNextCall(f)

# Manually trigger GC
%CollectGarbage()

# 'Is<type>' checks for various builtin types, e.g.
%IsArray(test_array)


## Extra:
# - full list of native syntax commands:
# src/runtime/runtime.h
#
# - examples
# test/debugger/debug/
#
# - Debugging over the V8 Inspector Protocol
# https://v8.dev/docs/inspector
# --enable-inspector flag
# Include test/mjsunit/mjsunit.js and test/debugger/test-api.js
# examples on test/debugger/debug folder