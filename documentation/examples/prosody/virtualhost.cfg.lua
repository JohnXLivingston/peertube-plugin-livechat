-- these global settings can affect an existing Prosody installation.
-- Use them with care.
-- NB: prosody http will be behind the nginx reverse proxy.
cross_domain_bosh = false;
consider_bosh_secure = true;
cross_domain_websocket = false;
consider_websocket_secure = true;
https_ports = {};
trusted_proxies = { "127.0.0.1", "::1" }

VirtualHost "your_domain"
        authentication = "anonymous"
        allow_anonymous_s2s = false
        ssl = {
                key = "/etc/prosody/certs/your_domain.key";
                certificate = "/etc/prosody/certs/your_domain.crt";
        }
        modules_enabled = {
                "http";
                "bosh";
                "ping";
                "websocket";
        }
        http_host = "your_domain"
        http_external_url = "http://your_domain"
        admins = { "admin@your_xmpp_provider_domain" }

Component "room.your_domain" "muc"
        admins = { "admin@your_xmpp_provider_domain" }
        restrict_room_creation = "local"
        muc_room_locking = false
        muc_tombstones = false
        muc_room_default_language = "fr"
        muc_room_default_public = true
        muc_room_default_persistent = false
        muc_room_default_members_only = false
        muc_room_default_moderated = false
        muc_room_default_public_jids = false
        muc_room_default_change_subject = false
        muc_room_default_history_length = 20
