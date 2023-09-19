-- Prosody IM
-- Copyright (C) 2008-2013 Matthew Wild
-- Copyright (C) 2008-2013 Waqas Hussain
-- Copyright (C) 2014 Kim Alvefur
--
-- This project is MIT/X11 licensed. Please see the
-- COPYING file in the source package for more information.
--

local new_sasl = require "util.sasl".new;
local path = require "util.paths";
local json = require "util.json";
-- local have_async, async = pcall(require, "util.async");

-- if not have_async then
-- 	error("Your version of Prosody does not support async and is incompatible");
-- end

local host = module.host;
local provider = {};

local bot_conf_folder = module:get_option_string('livechat_bot_conf_folder', '');

function read_global_conf(filename)
	local file = io.open(path.join(bot_conf_folder, filename), "r");
	if file == nil then
		module:log("debug", "Cant read global conf file", filename);
		return nil;
	end
	local content = file:read("*all");
	io.close(file);

	local o = json.decode(content);
	if (not o) then
		module:log("error", "Cant json-decode file", filename);
		return nil;
	end
	if (not o["connection"]) then
		return nil;
	end
	if (not o["connection"]["username"]) then
		return nil;
	end
	if (not o["connection"]["password"]) then
		return nil;
	end
	result = {
		username= o["connection"]["username"];
		password= o["connection"]["password"];
	};
	return result;
end

function provider.test_password(username, password)
	-- FIXME: adapt the code for multiple bots
	credentials = read_global_conf("moderator.json")
	if (credentials and credentials["username"] == username and credentials["password"] == password) then
		return true;
	end
	return false;
end

function provider.users()
	return function()
		return nil;
	end
end

function provider.set_password(username, password)
	return false;
end

function provider.user_exists(username)
	-- FIXME: adapt the code for multiple bots
	credentials = read_global_conf("moderator.json")
	if (credentials and credentials["username"] == username) then
		return true;
	end
	return false;
end

function provider.create_user(username, password)
	return false;
end

function provider.delete_user(username)
	return false;
end

function provider.get_sasl_handler()
	return new_sasl(host, {
		--luacheck: ignore 212/sasl 212/realm
		plain_test = function(sasl, username, password, realm)
			return provider.test_password(username, password), true;
		end;
	});
end

module:provides("auth", provider);
