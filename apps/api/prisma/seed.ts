import { PrismaClient, TaskStatus, TaskPriority, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('Password123!', 12);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@projectflow.dev' },
    update: {},
    create: { name: 'Alice Johnson', email: 'alice@projectflow.dev', password },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@projectflow.dev' },
    update: {},
    create: { name: 'Bob Martinez', email: 'bob@projectflow.dev', password },
  });

  const carlos = await prisma.user.upsert({
    where: { email: 'carlos@projectflow.dev' },
    update: {},
    create: { name: 'Carlos Rivera', email: 'carlos@projectflow.dev', password },
  });

  const team = await prisma.team.upsert({
    where: { slug: 'engineering-team-demo' },
    update: {},
    create: {
      name: 'Engineering Team',
      description: 'Main product engineering team',
      slug: 'engineering-team-demo',
      members: {
        create: [
          { userId: alice.id, role: Role.ADMIN },
          { userId: bob.id, role: Role.MANAGER },
          { userId: carlos.id, role: Role.DEVELOPER },
        ],
      },
    },
  });

  const project1 = await prisma.project.upsert({
    where: { id: 'demo-project-1' },
    update: {},
    create: {
      id: 'demo-project-1',
      name: 'Website Redesign',
      description: 'Complete redesign of the marketing website',
      status: 'ACTIVE',
      teamId: team.id,
    },
  });

  await prisma.project.upsert({
    where: { id: 'demo-project-2' },
    update: {},
    create: {
      id: 'demo-project-2',
      name: 'Mobile App v2',
      description: 'Second version of the mobile application',
      status: 'ACTIVE',
      teamId: team.id,
    },
  });

  const tasks: Array<{
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string | null;
    position: number;
  }> = [
    { title: 'Design new landing page',      status: TaskStatus.DONE,        priority: TaskPriority.HIGH,   assigneeId: alice.id,  position: 0 },
    { title: 'Implement authentication flow', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.URGENT, assigneeId: bob.id,    position: 1 },
    { title: 'Write API documentation',       status: TaskStatus.TODO,        priority: TaskPriority.MEDIUM, assigneeId: carlos.id, position: 2 },
    { title: 'Setup CI/CD pipeline',          status: TaskStatus.IN_REVIEW,   priority: TaskPriority.HIGH,   assigneeId: alice.id,  position: 3 },
    { title: 'Performance optimization',      status: TaskStatus.BACKLOG,     priority: TaskPriority.LOW,    assigneeId: null,      position: 4 },
    { title: 'Mobile responsive fixes',       status: TaskStatus.TODO,        priority: TaskPriority.MEDIUM, assigneeId: bob.id,    position: 5 },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        title: task.title,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        position: task.position,
        projectId: project1.id,
        creatorId: alice.id,
        description: `Task description for: ${task.title}`,
      },
    }).catch(() => {});
  }

  console.log('\nSeed complete!');
  console.log('Demo accounts (password: Password123!):');
  console.log('  alice@projectflow.dev  — Admin');
  console.log('  bob@projectflow.dev    — Manager');
  console.log('  carlos@projectflow.dev — Developer');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
