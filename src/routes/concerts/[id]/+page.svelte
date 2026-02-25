<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDate, isFuture } from '$lib/format';
	let { data, form } = $props();
	const concert = $derived(data.concert);
	const venue = $derived(data.venue);
	const myAttendance = $derived(data.myAttendance);
	const expecting = $derived(data.expecting);
	const attended = $derived(data.attended);
	const isCreator = $derived(data.user?.id === concert.createdBy);
	const future = $derived(isFuture(concert.dateTime));
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
		<p><a href={concert.ticketUrl} target="_blank" rel="noopener noreferrer">Køb billetter →</a></p>
	{/if}
	{#if concert.description}
		<p class="description">{concert.description}</p>
	{/if}
</div>

{#if data.genres.length > 0 || data.user}
	<div class="genre-row">
		{#each data.genres as genre}
			{#if data.user}
				<span class="genre-tag genre-tag-removable">
					{genre}<form method="POST" action="?/removeGenre" use:enhance class="genre-remove-form">
						<input type="hidden" name="genre" value={genre} />
						<button type="submit" class="genre-remove-btn" aria-label="Fjern {genre}">×</button>
					</form>
				</span>
			{:else}
				<span class="genre-tag">{genre}</span>
			{/if}
		{/each}
		{#if data.user}
			<form method="POST" action="?/addGenre" use:enhance class="genre-form">
				{#if form?.genreError}
					<span class="genre-error">{form.genreError}</span>
				{/if}
				<input
					type="text"
					name="genre"
					placeholder="+ tilføj genre"
					maxlength="30"
					class="genre-input"
					autocomplete="off"
				/>
			</form>
		{/if}
	</div>
{/if}

{#if data.user}
	<div class="attend-section">
		{#if myAttendance}
			<span class="attend-confirmed">
				{myAttendance.status === 'forventer' ? '✓ Du er med!' : '✓ Du var der!'}
			</span>
			{#if myAttendance.status === 'forventer' && !future}
				<form method="POST" action="?/attend" use:enhance>
					<input type="hidden" name="status" value="var_der" />
					<button type="submit" class="link-btn">Skift til "var der"</button>
				</form>
			{/if}
			<form method="POST" action="?/unattend" use:enhance>
				<button type="submit" class="link-btn">Fjern</button>
			</form>
		{:else}
			<form method="POST" action="?/attend" use:enhance>
				<input type="hidden" name="status" value={future ? 'forventer' : 'var_der'} />
				<button type="submit" class="attend-btn">
					{future ? '+1, jeg kommer!' : 'Jeg var der!'}
				</button>
			</form>
		{/if}
	</div>
{/if}

<div class="section">
	{#if future}
		<h2>Kommer ({expecting.length})</h2>
		{#if expecting.length > 0}
			<ul class="attendee-list">
				{#each expecting as { username }}
					<li><a href="/profile/{username}">{username}</a></li>
				{/each}
			</ul>
		{:else}
			<p class="empty">Ingen har tilmeldt sig endnu</p>
		{/if}
	{:else}
		<h2>Var der ({attended.length})</h2>
		{#if attended.length > 0}
			<ul class="attendee-list">
				{#each attended as { username }}
					<li><a href="/profile/{username}">{username}</a></li>
				{/each}
			</ul>
		{:else}
			<p class="empty">Ingen har markeret at de var der</p>
		{/if}
	{/if}
</div>
