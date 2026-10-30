-- MineForge Hosting — Step 1: extended server settings
-- Run this once in Supabase SQL Editor.
alter table public.mineforge_servers
  add column if not exists minecraft_version text not null default '1.21.11',
  add column if not exists max_players integer not null default 20,
  add column if not exists gamemode text not null default 'survival',
  add column if not exists difficulty text not null default 'normal',
  add column if not exists motd text not null default 'Welcome to MineForge!';

alter table public.mineforge_servers
  add constraint mineforge_servers_max_players_check
  check (max_players between 1 and 100);

alter table public.mineforge_servers
  add constraint mineforge_servers_gamemode_check
  check (gamemode in ('survival', 'creative', 'adventure'));

alter table public.mineforge_servers
  add constraint mineforge_servers_difficulty_check
  check (difficulty in ('peaceful', 'easy', 'normal', 'hard'));
