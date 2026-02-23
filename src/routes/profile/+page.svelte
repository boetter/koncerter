<script lang="ts">
	import { formatDate } from '$lib/format';
	let { data } = $props();
</script>

<h1>{data.user?.username}</h1>

<h2>Forventer at gå ({data.expecting.length})</h2>

{#if data.expecting.length === 0}
	<p class="empty">Ingen markerede koncerter.</p>
{:else}
	<ul class="list">
		{#each data.expecting as { concert, venueName }}
			<li class="list-item">
				<a href="/concerts/{concert.id}">{concert.artistName}</a>
				<div class="meta">{formatDate(concert.dateTime)} · {venueName}</div>
			</li>
		{/each}
	</ul>
{/if}

<div class="section">
	<h2>Var der ({data.attended.length})</h2>

	{#if data.attended.length === 0}
		<p class="empty">Ingen markerede koncerter.</p>
	{:else}
		<ul class="list">
			{#each data.attended as { concert, venueName }}
				<li class="list-item">
					<a href="/concerts/{concert.id}">{concert.artistName}</a>
					<div class="meta">{formatDate(concert.dateTime)} · {venueName}</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
