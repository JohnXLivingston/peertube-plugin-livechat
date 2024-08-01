-- SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
-- SPDX-License-Identifier: AGPL-3.0-only

-- Perform the search criteria.
-- Returns true if the item match.
-- Note: there is a logical OR between search_from and search_occupant_id
local function item_match(id, item, search_from, search_occupant_id)
  if (search_from ~= nil) then
    if (search_from == item.attr.from) then
      return true;
    end
  end
  if (search_occupant_id ~= nil) then
    local occupant_id = item:get_child("occupant-id", "urn:xmpp:occupant-id:0");
    if (occupant_id and occupant_id.attr.id == search_occupant_id) then
      return true;
    end
  end
  return false;
end

return {
  item_match = item_match;
};
