const std = @import("std");

pub export fn parseFunctionCallables(ptr: [*]const u8, len: u16) void {
    const buffer = ptr[0..len];
    std.debug.print("{s}\n", .{buffer});
}
