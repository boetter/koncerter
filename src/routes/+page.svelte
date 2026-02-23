<script lang="ts">
	import { formatDate } from '$lib/format';
	let { data } = $props();
</script>

<h1>Kommende koncerter</h1>

{#if data.upcoming.length === 0}
	<p class="empty">Ingen kommende koncerter.</p>
{:else}
	<ul class="list">
		{#each data.upcoming as { concert, venueName }}
			<li class="list-item">
				<a href="/concerts/{concert.id}">{concert.artistName}</a>
				<div class="meta">{formatDate(concert.dateTime)} · <a href="/venues/{concert.venueId}">{venueName}</a></div>
			</li>
		{/each}
	</ul>
{/if}

{#if data.recent.length > 0}
	<div class="section">
		<h2>Nyligt afholdte</h2>
		<ul class="list">
			{#each data.recent as { concert, venueName }}
				<li class="list-item">
					<a href="/concerts/{concert.id}">{concert.artistName}</a>
					<div class="meta">{formatDate(concert.dateTime)} · <a href="/venues/{concert.venueId}">{venueName}</a></div>
				</li>
			{/each}
		</ul>
	</div>
{/if}

{#if !data.user}
	<div class="section">
		<p><a href="/register">Opret konto</a> for at markere din deltagelse på koncerter.</p>
	</div>
{/if}
