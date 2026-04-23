-- ============================================================================
-- RPC — get_week_availability(week_start_utc timestamptz)
-- ============================================================================
--
-- Returns booked slot start times for the week beginning at `week_start_utc`.
-- The client reconstructs the 40-slot grid locally and marks the returned
-- timestamps as taken. Keeping this server-side logic trivial minimises the
-- surface where availability bugs can hide.
-- ============================================================================

create or replace function public.get_week_availability(week_start_utc timestamptz)
returns table (start_at timestamptz)
language sql
stable
as $$
  select b.start_at
  from public.bookings b
  where b.canceled_at is null
    and b.start_at >= week_start_utc
    and b.start_at <  week_start_utc + interval '7 days'
  order by b.start_at;
$$;
