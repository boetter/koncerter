<script lang="ts">
	let { data } = $props();
</script>

<div class="page-header">
	<h1>Koncertsteder</h1>
	{#if data.user}
		<a href="/venues/new" class="button secondary">Nyt sted</a>
	{/if}
</div>

{#if data.venues.length === 0}
	<p class="empty">Ingen koncertsteder endnu.</p>
{:else}
	<ul class="list">
		{#each data.venues as venue}
			<li class="list-item">
				<div class="list-main">
					<a href="/venues/{venue.id}">{venue.name}</a>
					<div class="meta">{venue.address} · {venue.concertCount} {venue.concertCount === 1 ? 'koncert' : 'koncerter'}</div>
				</div>
			</li>
		{/each}
	</ul>
{/if}
