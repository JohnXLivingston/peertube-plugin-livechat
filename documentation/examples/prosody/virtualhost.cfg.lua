cross_domain_bosh = false;
consider_bosh_secure = true;
consider_websocket_secure = true;
cross_domain_websocket = true;

VirtualHost "peertube.im.your_domain"
        authentication = "anonymous"
        allow_anonymous_s2s = false
        ssl = {
                key = "/etc/prosody/certs/peertube.im.your_domain.key";
                certificate = "/etc/prosody/certs/peertube.im.your_domain.crt";
                }
        modules_enabled = {
            "http";
            "bosh";
            "ping";
            "websocket";
        }
        http_host = "peertube.im.your_domain"
	http_external_url = "http://peertube.im.your_domain"
        admins = { "admin@im.your_domain" }

Component "room.peertube.im.your_domain" "muc"
        admins = { "admin@im.your_domain" }
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
