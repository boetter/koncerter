<script lang="ts">
	import { formatDate } from '$lib/format';
	let { data } = $props();
</script>

<div class="page-header">
	<h1>Koncerter</h1>
	{#if data.user}
		<a href="/concerts/new" class="button secondary">Ny koncert</a>
	{/if}
</div>

{#if data.upcoming.length > 0}
	<h2>Kommende</h2>
	<ul class="list">
		{#each data.upcoming as { concert, venueName, attendanceCount }}
			<li class="list-item">
				<div class="list-main">
					<a href="/concerts/{concert.id}">{concert.artistName}</a>
					<div class="meta">{formatDate(concert.dateTime)} · <a href="/venues/{concert.venueId}">{venueName}</a></div>
				</div>
				{#if attendanceCount > 0}
					<span class="count-badge">{attendanceCount}</span>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

{#if data.past.length > 0}
	<div class="section">
		<h2>Afholdte</h2>
		<ul class="list">
			{#each data.past as { concert, venueName, attendanceCount }}
				<li class="list-item">
					<div class="list-main">
						<a href="/concerts/{concert.id}">{concert.artistName}</a>
						<div class="meta">{formatDate(concert.dateTime)} · <a href="/venues/{concert.venueId}">{venueName}</a></div>
					</div>
					{#if attendanceCount > 0}
						<span class="count-badge">{attendanceCount}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}

{#if data.upcoming.length === 0 && data.past.length === 0}
	<p class="empty">Ingen koncerter endnu.</p>
{/if}
