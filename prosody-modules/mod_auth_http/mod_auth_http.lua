-- Prosody IM
-- Copyright (C) 2008-2013 Matthew Wild
-- Copyright (C) 2008-2013 Waqas Hussain
-- Copyright (C) 2014 Kim Alvefur
--
-- This project is MIT/X11 licensed. Please see the
-- COPYING file in the source package for more information.
--

local new_sasl = require "util.sasl".new;
local base64 = require "util.encodings".base64.encode;
local have_async, async = pcall(require, "util.async");
local http = require "net.http";

if not have_async then
	error("Your version of Prosody does not support async and is incompatible");
end

local host = module.host;

local api_base = module:get_option_string("http_auth_url",  ""):gsub("$host", host);
if api_base == "" then error("http_auth_url required") end
api_base = api_base:gsub("/$", "");

local auth_creds = module:get_option_string("http_auth_credentials");

local method_types = {
	-- Unlisted methods default to GET
	register = "POST";
	set_password = "POST";
	remove_user = "POST";
};

local provider = {};

local function make_request(method_name, params)
	local wait, done = async.waiter();

	local method_type = method_types[method_name] or "GET";

	params.server = params.server or host;
	local encoded_params = http.formencode(params);

	local url;
	local ex = {
		method = method_type;
		headers = { Authorization = auth_creds and ("Basic "..base64(auth_creds)) or nil; };
	}
	if method_type == "POST" then
		url = api_base.."/"..method_name;
		ex.headers["Content-Type"] = "application/x-www-form-urlencoded";
		ex.body = encoded_params;
	else
		url = api_base.."/"..method_name.."?"..encoded_params;
	end

	local content, code;
	local function cb(content_, code_)
		content, code = content_, code_;
		done();
	end
	http.request(url, ex, cb);
	wait();
	return code, content;
end

function provider.test_password(username, password)
	local code, body = make_request("check_password", { user = username, pass = password });
	if code == 200 and body == "true" then
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
	local code = make_request("set_password", { user = username, pass = password });
	if code == 200 or code == 201 or code == 204 then
		return true;
	end
	return false;
end

function provider.user_exists(username)
	local code, body = make_request("user_exists", { user = username });
	if code == 200 and body == "true" then
		return true;
	end
	return false;
end

function provider.create_user(username, password)
	local code = make_request("register", { user = username, pass = password });
	if code == 201 then
		return true;
	end
	return false;
end

function provider.delete_user(username)
	local code = make_request("remove_user", { user = username });
	if code == 200 or code == 201 or code == 204 then
		return true;
	end
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
