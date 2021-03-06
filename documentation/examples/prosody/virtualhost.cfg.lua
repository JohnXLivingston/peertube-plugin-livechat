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
        admins = { "username@your_external_xmpp_provider_domain" }

Component "room.peertube.im.your_domain" "muc"
        admins = { "username@your_external_xmpp_provider_domain" }
-- AS THIS MODULE BELOW SAVES LOGS OF THE CHAT, YOU MUST MENTION THIS ON THE ABOUT PAGE OF YOUR INSTANCE FOR LEGAL REASONS.
-- If you want to use this module so the log is saved, you have to install "prosody-modules" package and uncomment the lines below. Then restart Prosody with "sudo systemctl restart prosody"
--	modules_enabled = { "mam_muc" }
--      muc_log_by_default = true
--      muc_log_presences = true
--      log_all_rooms = true
--      muc_log_expires_after = "never"
--      muc_log_cleanup_interval = 4 * 60 * 60

        restrict_room_creation = "local"
        muc_room_locking = false
        muc_tombstones = false
        muc_room_default_language = "en"
        muc_room_default_public = true
        muc_room_default_persistent = true
        muc_room_default_members_only = false
        muc_room_default_moderated = false
        muc_room_default_public_jids = false
        muc_room_default_change_subject = false
        muc_room_default_history_length = 20
