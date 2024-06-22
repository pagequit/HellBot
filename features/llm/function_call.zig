const std = @import("std");

pub export fn parseFunctionCallables(ptr: [*]const u8, len: u16) void {
    const chunk: []const u8 = ptr[0..len];
    // const line: []const u8 = std.mem.trim(u8, chunk, " \n");
    // const res = std.mem.splitSequence(u8, chunk, ":");

    std.debug.print("{s}", .{chunk});
}
