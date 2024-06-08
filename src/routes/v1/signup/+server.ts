import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as {
		username: string;
		password: string;
	};

	let { username, password } = body;
	username = username.replaceAll(/['"`;%|]/g, '').trim();
	password = password.replaceAll(/['"`;%|]/g, '').trim();

	if (username.length < 4 || password.length < 8) {
		return new Response(
			JSON.stringify({ success: false, message: 'Данные введены некорректно' }, null, 2),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 400
			}
		);
	}

	const userExists = await prisma.user.findFirst({
		where: {
			username
		}
	});

	if (userExists) {
		return new Response(null, {
			status: 409
		});
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const created = await prisma.user.create({
		data: {
			username,
			password: hashedPassword
		}
	});

	return new Response(null, {
		status: 200
	});
};
