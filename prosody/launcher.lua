#!/usr/bin/env lua

-- This file is a launcher, that takes the first argument to choose what to launch.

local what = table.remove(arg, 1);
if what == 'prosody' then
  dofile('/usr/bin/prosody');
elseif what == 'prosodyctl' then
  dofile('/usr/bin/prosodyctl');
else
  print("Unknown command: "..what);
  os.exit(1);
end
