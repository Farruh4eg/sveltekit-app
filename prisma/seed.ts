import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await prisma.role.createMany({
		data: [
			{
				id: 1,
				role: 'default'
			},
			{
				id: 2,
				role: 'admin'
			}
		]
	});
}
