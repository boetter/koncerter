<script lang="ts">
	import { formatDate } from '$lib/format';
	let { data } = $props();
</script>

<h1>{data.user?.username}</h1>

<h2>Skal til ({data.upcoming.length})</h2>

{#if data.upcoming.length === 0}
	<p class="empty">Ingen kommende koncerter</p>
{:else}
	<ul class="list">
		{#each data.upcoming as { concert, venueName }}
			<li class="list-item">
				<div class="list-main">
					<a href="/concerts/{concert.id}">{concert.artistName}</a>
					<div class="meta">{formatDate(concert.dateTime)} · {venueName}</div>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<div class="section">
	<h2>Har været til ({data.past.length})</h2>

	{#if data.past.length === 0}
		<p class="empty">Ingen afholdte koncerter</p>
	{:else}
		<ul class="list">
			{#each data.past as { concert, venueName }}
				<li class="list-item">
					<div class="list-main">
						<a href="/concerts/{concert.id}">{concert.artistName}</a>
						<div class="meta">{formatDate(concert.dateTime)} · {venueName}</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
