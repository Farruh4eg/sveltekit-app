import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as { username: string; password: string };
	let username = body.username;
	let password = body.password;

	username = username.replaceAll(/['"`;%|]/g, '').trim();
	password = password.replaceAll(/['"`;%|]/g, '').trim();

	const sensitiveUser = await prisma.user.findFirst({
		where: {
			username
		},
		select: {
			password: true,
			id: true
		}
	});

	if (sensitiveUser) {
		const isSame = await bcrypt.compare(password, sensitiveUser.password);

		if (isSame) {
			const user = await prisma.user.findFirst({
				where: {
					username
				},
				select: {
					username: true,
					id: true,
					Role: {
						select: {
							role: true
						}
					}
				}
			});

			return new Response(JSON.stringify({ user, role: user?.Role.role }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			return new Response(null, {
				status: 401
			});
		}
	}

	return new Response(null, {
		status: 404
	});
};
