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

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
