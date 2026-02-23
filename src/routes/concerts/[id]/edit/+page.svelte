<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();

	// datetime-local input expects "YYYY-MM-DDTHH:MM"
	function toLocalInput(iso: string) {
		const d = new Date(iso);
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

	const c = $derived(data.concert);
</script>

<h1>Rediger koncert</h1>

<form method="POST" action="?/save" use:enhance>
	{#if form?.error}
		<p class="form-error">{form.error}</p>
	{/if}

	<div class="form-group">
		<label for="venue_id">Koncertsted</label>
		<select id="venue_id" name="venue_id" required>
			{#each data.venues as venue}
				<option value={venue.id} selected={venue.id === (form?.venueId ?? c.venueId)}>
					{venue.name}
				</option>
			{/each}
		</select>
	</div>

	<div class="form-group">
		<label for="artist_name">Artist / band</label>
		<input id="artist_name" name="artist_name" type="text" required value={form?.artistName ?? c.artistName} />
	</div>

	<div class="form-group">
		<label for="date_time">Dato og tidspunkt</label>
		<input id="date_time" name="date_time" type="datetime-local" required value={form?.dateTime ? form.dateTime : toLocalInput(c.dateTime)} />
	</div>

	<div class="form-group">
		<label for="description">Beskrivelse (valgfrit)</label>
		<textarea id="description" name="description">{form?.description ?? c.description ?? ''}</textarea>
	</div>

	<div class="form-group">
		<label for="ticket_url">Billet-URL (valgfrit)</label>
		<input id="ticket_url" name="ticket_url" type="url" value={form?.ticketUrl ?? c.ticketUrl ?? ''} />
	</div>

	<div class="form-actions">
		<button type="submit">Gem</button>
		<a href="/concerts/{c.id}">Annuller</a>
	</div>
</form>

<div class="section">
	<form method="POST" action="?/delete" use:enhance>
		<button type="submit" class="danger">Slet koncert</button>
	</form>
</div>
