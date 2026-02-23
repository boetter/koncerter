<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
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
		<input id="date_time" name="date_time" type="datetime-local" required value={form?.dateTime ?? ''} />
	</div>

	<div class="form-group">
		<label for="description">Beskrivelse (valgfrit)</label>
		<textarea id="description" name="description">{form?.description ?? ''}</textarea>
	</div>

	<div class="form-group">
		<label for="ticket_url">Billet-URL (valgfrit)</label>
		<input id="ticket_url" name="ticket_url" type="url" value={form?.ticketUrl ?? ''} />
	</div>

	<div class="form-actions">
		<button type="submit">Gem</button>
		<a href="/concerts">Annuller</a>
	</div>
</form>
