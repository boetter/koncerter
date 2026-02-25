<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();

	let defaultDT = $state('');

	$effect(() => {
		const now = new Date();
		const pad = (n: number) => String(n).padStart(2, '0');
		const today20 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0);
		const target = today20 > now ? today20 : new Date(today20.getTime() + 86400000);
		defaultDT = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T20:00`;
	});
</script>

<h1>Ny koncert</h1>

<form method="POST" use:enhance>
	{#if form?.error}
		<p class="form-error">{form.error}</p>
	{/if}

	<div class="form-group">
		<label for="venue_id">Koncertsted</label>
		<select id="venue_id" name="venue_id" required>
			<option value="">Vælg sted...</option>
			{#each data.venues as venue}
				<option value={venue.id} selected={String(form?.venueId ?? data.preselectedVenueId) === String(venue.id)}>
					{venue.name}
				</option>
			{/each}
		</select>
	</div>

	<div class="form-group">
		<label for="artist_name">Artist / band</label>
		<input id="artist_name" name="artist_name" type="text" required value={form?.artistName ?? ''} />
	</div>

	<div class="form-group">
		<label for="date_time">Dato og tidspunkt</label>
		<input id="date_time" name="date_time" type="datetime-local" required value={form?.dateTime ?? defaultDT} />
	</div>

	<div class="form-actions">
		<button type="submit">Opret koncert</button>
		<a href="/concerts">Annuller</a>
	</div>
</form>
