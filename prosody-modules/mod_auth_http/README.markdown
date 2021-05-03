---
labels:
- Stage-Alpha
summary: "Authenticate users against an external HTTP API"
...

# Overview

This authentication module allows Prosody to authenticate users against
an external HTTP service.

# Configuration

``` lua
VirtualHost "example.com"
  authentication = "http"
  http_auth_url = "http://example.com/auth"
```

If the API requires Prosody to authenticate, you can provide static
credentials using HTTP Basic authentication, like so:

```
http_auth_credentials = "prosody:secret-password"
```

# Developers

This section contains information for developers who wish to implement a
HTTP service that Prosody can use for authentication.

## Protocol

Prosody will make a HTTP request to the configured API URL with an
appended `/METHOD` where `METHOD` is one of the methods described below.

GET methods must expect a series of URL-encoded query parameters, while
POST requests will receive an URL-encoded form (i.e.
`application/x-www-form-urlencoded`).

## Parameters

user
: The username, e.g. `stephanie` for the JID `stephanie@example.com`.

server
: The host part of the user's JID, e.g. `example.com` for the JID
  `stephanie@example.com`.

pass
: For methods that verify or set a user's password, the password will
  be supplied in this parameter, otherwise it is not set.

## Methods

The only mandatory methods that the service must implement are `check_password`
and `user_exists`. Unsupported methods should return a HTTP status code
of `501 Not Implemented`, but other error codes will also be handled by
Prosody.

### register

**HTTP method:**
: POST

**Success codes:**
: 201

**Error codes:**
: 409 (user exists)

### check_password

**HTTP method:**
: GET

**Success codes:**
: 200

**Response:**
: A text string of `true` if the user exists, or `false` otherwise.

### user_exists

**HTTP method:**
: GET

**Success codes:**
: 200

**Response:**
: A text string of `true` if the user exists, or `false` otherwise.

### set_password

**HTTP method:**
: POST

**Success codes:**
: 200, 201, or 204

### remove_user

**HTTP method:**
: POST

**Success codes:**
: 200, 201 or 204

## Examples

With the following configuration:

```
authentication = "http"
http_auth_url = "https://auth.example.net/api"

If a user connects and tries to log in to Prosody as "romeo@example.net"
with the password "iheartjuliet", Prosody would make the following HTTP
request:

```
https://auth.example.net/api/check_password?user=romeo&server=example.net&pass=iheartjuliet
```

# Compatibility

Requires Prosody 0.11.0 or later.
