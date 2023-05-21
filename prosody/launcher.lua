#!/usr/bin/env lua

-- This file is a launcher, that takes the first argument to choose what to launch.

local what = table.remove(arg, 1);
if what == 'debug' then
  -- Special debug mode. Should not be used in production.
  -- Note: i did not achieve to make it properly work (Prosody uses coroutines, and i did not manage to use breakpoints)
  print('Activating MobDebug...');
  mobdebug_path = table.remove(arg, 1);
  mobdebug_host = table.remove(arg, 1);
  mobdebug_port = table.remove(arg, 1);
  local lua_path_sep = package.config:sub(3,3);
  local dir_sep = package.config:sub(1,1);
  package.path = package.path..lua_path_sep..mobdebug_path..dir_sep.."?.lua";
  require "mobdebug".checkcount = 1;
  require "mobdebug".start(mobdebug_host, mobdebug_port);
  require "mobdebug".coro();
  what = table.remove(arg, 1);
end

if what == 'prosody' then
  dofile('/usr/bin/prosody');
elseif what == 'prosodyctl' then
  dofile('/usr/bin/prosodyctl');
else
  print("Unknown command: "..what);
  os.exit(1);
end
