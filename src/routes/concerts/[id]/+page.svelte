<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDate, isFuture } from '$lib/format';
	let { data } = $props();
	const concert = $derived(data.concert);
	const venue = $derived(data.venue);
	const myAttendance = $derived(data.myAttendance);
	const expecting = $derived(data.expecting);
	const attended = $derived(data.attended);
	const isCreator = $derived(data.user?.id === concert.createdBy);
</script>

<div class="page-header">
	<h1>{concert.artistName}</h1>
	{#if isCreator}
		<a href="/concerts/{concert.id}/edit" class="button secondary">Rediger</a>
	{/if}
</div>

<div class="detail-meta">
	<p>{formatDate(concert.dateTime)}</p>
	<p><a href="/venues/{venue.id}">{venue.name}</a> · {venue.address}</p>
	{#if concert.ticketUrl}
		<p><a href={concert.ticketUrl} target="_blank" rel="noopener">Køb billetter</a></p>
	{/if}
	{#if concert.description}
		<p style="margin-top:0.75rem; color: var(--color-text)">{concert.description}</p>
	{/if}
</div>

{#if data.user}
	<div class="section">
		<h2>Din markering</h2>

		{#if myAttendance}
			<p class="attendance-status">
				Du har markeret: <strong>{myAttendance.status === 'forventer' ? 'Forventer at gå' : 'Var der'}</strong>
			</p>
			<div class="attendance-actions">
				{#if myAttendance.status === 'var_der'}
					<form method="POST" action="?/attend" use:enhance>
						<input type="hidden" name="status" value="forventer" />
						<button type="submit" class="secondary">Skift til: Forventer at gå</button>
					</form>
				{:else}
					<form method="POST" action="?/attend" use:enhance>
						<input type="hidden" name="status" value="var_der" />
						<button type="submit" class="secondary">Skift til: Var der</button>
					</form>
				{/if}
				<form method="POST" action="?/unattend" use:enhance>
					<button type="submit" class="danger">Fjern markering</button>
				</form>
			</div>
		{:else}
			<div class="attendance-actions">
				<form method="POST" action="?/attend" use:enhance>
					<input type="hidden" name="status" value="forventer" />
					<button type="submit" class="secondary">
						Jeg forventer at gå
					</button>
				</form>
				<form method="POST" action="?/attend" use:enhance>
					<input type="hidden" name="status" value="var_der" />
					<button type="submit" class="secondary">Jeg var der</button>
				</form>
			</div>
		{/if}
	</div>
{/if}

<div class="section">
	<h2>Deltagere</h2>
	<div class="attendee-cols">
		<div>
			<strong>Forventer at gå ({expecting.length})</strong>
			{#if expecting.length > 0}
				<ul class="attendee-list" style="margin-top:0.5rem">
					{#each expecting as { username }}
						<li>{username}</li>
					{/each}
				</ul>
			{:else}
				<p class="empty">Ingen endnu</p>
			{/if}
		</div>
		<div>
			<strong>Var der ({attended.length})</strong>
			{#if attended.length > 0}
				<ul class="attendee-list" style="margin-top:0.5rem">
					{#each attended as { username }}
						<li>{username}</li>
					{/each}
				</ul>
			{:else}
				<p class="empty">Ingen endnu</p>
			{/if}
		</div>
	</div>
</div>
