create table if not exists users (
  id integer primary key autoincrement,
  phone_e164 text not null unique,
  display_name text,
  profile_summary text,
  preferences_json text not null default '{}',
  memories_json text not null default '[]',
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);

create table if not exists messages (
  id integer primary key autoincrement,
  user_id integer not null references users(id) on delete cascade,
  role text not null,
  body text,
  provider_message_id text,
  created_at text not null default current_timestamp
);

create index if not exists idx_messages_user_created on messages(user_id, created_at desc);
