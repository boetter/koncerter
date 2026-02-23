<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<h1>Nyt koncertsted</h1>

<form method="POST" use:enhance>
	{#if form?.error}
		<p class="form-error">{form.error}</p>
	{/if}

	<div class="form-group">
		<label for="name">Navn</label>
		<input id="name" name="name" type="text" required value={form?.name ?? ''} />
	</div>

	<div class="form-group">
		<label for="address">Adresse</label>
		<input id="address" name="address" type="text" required value={form?.address ?? ''} />
	</div>

	<div class="form-group">
		<label for="website_url">Hjemmeside (valgfrit)</label>
		<input id="website_url" name="website_url" type="url" value={form?.websiteUrl ?? ''} />
	</div>

	<div class="form-actions">
		<button type="submit">Gem</button>
		<a href="/venues">Annuller</a>
	</div>
</form>
