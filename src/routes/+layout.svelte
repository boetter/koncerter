<script lang="ts">
	import '../app.css';
	let { children, data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head>
	<title>Koncerter</title>
</svelte:head>

<div class="site">
	<header>
		<nav>
			<a href="/" class="site-title">Koncerter</a>
			<div class="nav-links">
				<a href="/concerts">Koncerter</a>
				<a href="/venues">Steder</a>
				{#if user}
					<a href="/profile">{user.username}</a>
					<form method="POST" action="/logout">
						<button type="submit">Log ud</button>
					</form>
				{:else}
					<a href="/login">Log ind</a>
					<a href="/register">Opret konto</a>
				{/if}
			</div>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>
</div>
