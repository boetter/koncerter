<script lang="ts">
	import { formatDate } from '$lib/format';
	let { data } = $props();
	const venue = $derived(data.venue);
	const concerts = $derived(data.concerts);
	const isCreator = $derived(data.user?.id === venue.createdBy);
</script>

<div class="page-header">
	<h1>{venue.name}</h1>
	{#if isCreator}
		<a href="/venues/{venue.id}/edit" class="button secondary">Rediger</a>
	{/if}
</div>

<div class="detail-meta">
	<p>{venue.address}</p>
	{#if venue.websiteUrl}
		<p><a href={venue.websiteUrl} target="_blank" rel="noopener">{venue.websiteUrl}</a></p>
	{/if}
</div>

<div class="action-row">
	{#if data.user}
		<a href="/concerts/new?venue={venue.id}" class="button secondary">Ny koncert her</a>
	{/if}
</div>

<h2>Koncerter</h2>

{#if concerts.length === 0}
	<p class="empty">Ingen koncerter endnu.</p>
{:else}
	<ul class="list">
		{#each concerts as concert}
			<li class="list-item">
				<a href="/concerts/{concert.id}">{concert.artistName}</a>
				<div class="meta">{formatDate(concert.dateTime)}</div>
			</li>
		{/each}
	</ul>
{/if}
