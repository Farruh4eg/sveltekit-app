<script lang="ts">
	import { isLoggedIn, role, user } from '$lib/session.js';
	import { onDestroy } from 'svelte';

	let isLogged: boolean;
	let errorElement: HTMLSpanElement;
	let username: string = '';
	let password: string = '';

	$: {
		if (isLogged) {
			isLoggedIn.set(true);
			localStorage.setItem('isLoggedIn', 'true');
		}
	}

	async function submitForm() {
		const response = await fetch('/v1/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		if (response.ok) {
			const body = await response.json();
			isLoggedIn.set(true);
			role.set(body.role);
			localStorage.setItem('user', JSON.stringify(body.user));
			window.location.href = '/home';
		} else if (response.status === 401) {
			setTimeout(() => {
				errorElement.textContent = 'Неверный логин или пароль';
				window.location.reload();
			}, 2000);
		} else {
			console.error(response.status);
		}
	}

	const isLoggedInUnsub = isLoggedIn.subscribe((value) => {
		isLogged = value;
	});

	onDestroy(() => {
		isLoggedInUnsub();
	});
</script>

<section
	class="w-[700px] bg-white justify-center flex rounded-3xl h-[36rem] mx-auto mt-24 shadow-lg flex-col"
>
	<form
		class="w-full flex flex-col p-4 gap-y-12 h-full items-center justify-center"
		on:submit|preventDefault={submitForm}
	>
		<h1 class="h-max text-3xl text-gray-700 font-bold">Вход</h1>
		<section class="flex flex-col justify-center w-full gap-y-2 items-center">
			<label for="username"> Логин </label>
			<input
				type="text"
				name="username"
				bind:value={username}
				minlength="4"
				class="w-7/12 box-content py-2 px-5 rounded-lg shadow-md border border-gray-300"
				required
			/>
		</section>
		<section class="flex flex-col justify-center w-full gap-y-2 items-center">
			<label for="password"> Пароль </label>
			<input
				type="password"
				name="password"
				minlength="8"
				class="w-7/12 box-content py-2 px-2 rounded-lg shadow-md border border-gray-300 relative pr-8"
				bind:value={password}
				required
			/>
		</section>
		<section class="h-max w-7/12 p-2 box-content text-center text-red-500 text-lg">
			<p bind:this={errorElement} class="text-sm" />
		</section>
		<button
			type="submit"
			class="bg-white py-3 rounded-xl px-10 hover:bg-blue-500 hover:text-white shadow-md border border-gray-200"
			>Вход</button
		>
	</form>
	<span class="flex w-full justify-center items-center p-4 gap-x-2">
		Нет учетной записи?
		<a href="/signup" class="text-blue-600 text-lg">Регистрация</a>
	</span>
</section>
