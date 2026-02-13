-- Rename availability JSON key: oneOnOnePerMonth → oneOnOneFrequency
-- Converts numeric values to enum strings: 4+ → "weekly", 2-3 → "biweekly", 1 → "monthly"

-- Weekly (4+ per month)
UPDATE mentors
SET availability = json_set(
  json_remove(availability, '$.oneOnOnePerMonth'),
  '$.oneOnOneFrequency', 'weekly'
)
WHERE json_extract(availability, '$.oneOnOnePerMonth') >= 4;

-- Bi-weekly (2-3 per month)
UPDATE mentors
SET availability = json_set(
  json_remove(availability, '$.oneOnOnePerMonth'),
  '$.oneOnOneFrequency', 'biweekly'
)
WHERE json_extract(availability, '$.oneOnOnePerMonth') >= 2
  AND json_extract(availability, '$.oneOnOnePerMonth') < 4;

-- Monthly (1 per month)
UPDATE mentors
SET availability = json_set(
  json_remove(availability, '$.oneOnOnePerMonth'),
  '$.oneOnOneFrequency', 'monthly'
)
WHERE json_extract(availability, '$.oneOnOnePerMonth') = 1;
