const std = @import("std");
const expect = std.testing.expect;

test "while if bla test" {
    var sum: u8 = 0;
    var i: u8 = 0;
    while (i <= 3) : (i += 1) {
        sum += if (i == 2) 0 else i;
    }

    try expect(sum == 4);
}

